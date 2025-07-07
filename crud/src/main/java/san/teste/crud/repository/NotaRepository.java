package san.teste.crud.repository;

import san.teste.crud.model.Nota;
import san.teste.crud.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotaRepository extends JpaRepository<Nota, Long> {
    List<Nota> findByUser(User user);
}