package san.teste.crud.controller;

import san.teste.crud.model.Nota;
import san.teste.crud.model.User;
import san.teste.crud.repository.NotaRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Controller
@RequestMapping("/notas")
public class NotaController {

    private final NotaRepository notaRepository;

    public NotaController(NotaRepository notaRepository) {
        this.notaRepository = notaRepository;
    }

  // NotaController.java
@GetMapping("")
public String mostrarNotas(Model model, HttpSession session) {
    User user = (User) session.getAttribute("usuarioLogado"); // Alterado para "usuarioLogado"
    if (user == null) return "redirect:/";

    model.addAttribute("notas", notaRepository.findByUser(user));
    model.addAttribute("nota", new Nota());
    return "notas";
}

    @PostMapping("/salvar")
    public String salvarNota(@ModelAttribute Nota nota, HttpSession session) {
        User user = (User) session.getAttribute("usuarioLogado");
        if (user == null) return "redirect:/";

        nota.setUser(user);
        nota.setDataCriacao(LocalDateTime.now());
        notaRepository.save(nota);
        return "redirect:/notas";
    }

    @GetMapping("/editar/{id}")
    public String editarNota(@PathVariable Long id, Model model, HttpSession session) {
        User user = (User) session.getAttribute("usuarioLogado");
        if (user == null) return "redirect:/";

        Nota nota = notaRepository.findById(id).orElse(null);
        if (nota == null || !nota.getUser().getId().equals(user.getId())) {
            return "redirect:/notas";
        }

        model.addAttribute("notas", notaRepository.findByUser(user));
        model.addAttribute("nota", nota);
        return "notas";
    }

    @GetMapping("/concluir/{id}")
    public String concluirNota(@PathVariable Long id, HttpSession session) {
        User user = (User) session.getAttribute("usuarioLogado");
        if (user == null) return "redirect:/";

        Nota nota = notaRepository.findById(id).orElse(null);
        if (nota != null && nota.getUser().getId().equals(user.getId())) {
            nota.setConcluida(!nota.isConcluida());
            notaRepository.save(nota);
        }
        return "redirect:/notas";
    }

    @GetMapping("/deletar/{id}")
    public String deletarNota(@PathVariable Long id, HttpSession session) {
        User user = (User) session.getAttribute("usuarioLogado");
        if (user == null) return "redirect:/";

        Nota nota = notaRepository.findById(id).orElse(null);
        if (nota != null && nota.getUser().getId().equals(user.getId())) {
            notaRepository.delete(nota);
        }
        return "redirect:/notas";
    }
}