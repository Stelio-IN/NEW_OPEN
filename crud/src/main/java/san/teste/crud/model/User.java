package san.teste.crud.model;

import jakarta.persistence.*;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String email;
    private String celular;
    private String morada;
    private String password;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Nota> notas;

@Transient  // Indica que este campo não será persistido no banco
    private MultipartFile fotoPerfilFile;
    
    private String fotoPerfil; // Armazena apenas o caminho/nome do arquivo

    // ... getters e setters ...
    public MultipartFile getFotoPerfilFile() {
        return fotoPerfilFile;
    }

    public void setFotoPerfilFile(MultipartFile fotoPerfilFile) {
        this.fotoPerfilFile = fotoPerfilFile;
    }

    public String getFotoPerfil() {
        return fotoPerfil;
    }

    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCelular() {
        return celular;
    }

    public void setCelular(String celular) {
        this.celular = celular;
    }

    public String getMorada() {
        return morada;
    }

    public void setMorada(String morada) {
        this.morada = morada;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Nota> getNotas() {
        return notas;
    }

    public void setNotas(List<Nota> notas) {
        this.notas = notas;
    }
   
}