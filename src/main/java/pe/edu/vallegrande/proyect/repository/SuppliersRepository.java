package pe.edu.vallegrande.proyect.repository;

import pe.edu.vallegrande.proyect.model.Suppliers;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SuppliersRepository extends JpaRepository<Suppliers, Long> {
    List<Suppliers> findByState(String state);
}
