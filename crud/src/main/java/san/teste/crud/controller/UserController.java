package san.teste.crud.controller;

import san.teste.crud.model.User;
import san.teste.crud.repository.UserRepository;
import san.teste.crud.service.FileStorageService;
import jakarta.servlet.http.HttpSession;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Controller
public class UserController {

    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    
    public UserController(UserRepository userRepository, FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/")
    public String mostrarLogin(Model model) {
        model.addAttribute("user", new User());
        return "index";
    }

    @PostMapping("/login")
    public String processarLogin(@ModelAttribute User user, Model model, HttpSession session) {
        User usuario = userRepository.findByEmailAndPassword(user.getEmail(), user.getPassword());
        if (usuario != null) {
            session.setAttribute("usuarioLogado", usuario);
            return "redirect:/notas";
        } else {
            model.addAttribute("error", "Email ou senha inválidos");
            return "index";
        }
    }

    @PostMapping("/registar")
    public String registarUsuario(@ModelAttribute User user, 
                                @RequestParam(value = "fotoPerfil", required = false) MultipartFile fotoPerfil,
                                Model model) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            model.addAttribute("error", "Email já registado");
            return "index";
        }

        try {
            if (fotoPerfil != null && !fotoPerfil.isEmpty()) {
                String fileName = fileStorageService.storeFile(fotoPerfil, user.getId());
                user.setFotoPerfil(fileName);
            }
            
            userRepository.save(user);
            model.addAttribute("success", "Conta criada com sucesso. Faça login.");
        } catch (Exception e) {
            model.addAttribute("error", "Erro ao registrar usuário: " + e.getMessage());
        }
        
        return "index";
    }

    @GetMapping("/perfil")
    public String mostrarPerfil(Model model, HttpSession session) {
        User userSession = (User) session.getAttribute("usuarioLogado");
        if (userSession == null) {
            return "redirect:/";
        }

        // Busca o usuário atualizado no banco de dados
        User user = userRepository.findById(userSession.getId()).orElse(null);
        if (user == null) {
            session.invalidate();
            return "redirect:/";
        }

        // Cria um novo objeto para o formulário para evitar problemas de binding
        User userForm = new User();
        userForm.setId(user.getId());
        userForm.setNome(user.getNome());
        userForm.setEmail(user.getEmail());
        userForm.setCelular(user.getCelular());
        userForm.setMorada(user.getMorada());
        userForm.setFotoPerfil(user.getFotoPerfil());

        model.addAttribute("user", userForm);
        return "perfil";
    }

   @PostMapping("/atualizar-perfil")
public String atualizarPerfil(@ModelAttribute("user") User userForm,
                            HttpSession session, 
                            Model model) {
    User userSession = (User) session.getAttribute("usuarioLogado");
    if (userSession == null) {
        return "redirect:/";
    }

    try {
        // Atualiza os dados básicos
        userSession.setNome(userForm.getNome());
        userSession.setEmail(userForm.getEmail());
        userSession.setCelular(userForm.getCelular());
        userSession.setMorada(userForm.getMorada());
        
        // Processa a foto de perfil se foi enviada
        MultipartFile fotoFile = userForm.getFotoPerfilFile();
        if (fotoFile != null && !fotoFile.isEmpty()) {
            String fileName = fileStorageService.storeFile(fotoFile, userSession.getId());
            userSession.setFotoPerfil(fileName);
        }
        
        userRepository.save(userSession);
        session.setAttribute("usuarioLogado", userSession);
        
        model.addAttribute("success", "Perfil atualizado com sucesso!");
        model.addAttribute("user", userSession);
    } catch (Exception e) {
        model.addAttribute("error", "Erro ao atualizar perfil: " + e.getMessage());
    }
    
    return "perfil";
}
    
    @GetMapping("/foto-perfil/{userId}")
    public ResponseEntity<Resource> getFotoPerfil(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId).orElseThrow();
            
            if (user.getFotoPerfil() == null || user.getFotoPerfil().isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Resource resource = fileStorageService.loadFileAsResource(user.getFotoPerfil());
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }
}