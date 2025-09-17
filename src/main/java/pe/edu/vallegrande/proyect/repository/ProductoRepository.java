package pe.edu.vallegrande.proyect.repository;

import pe.edu.vallegrande.proyect.model.Producto;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByState(String state);
}
