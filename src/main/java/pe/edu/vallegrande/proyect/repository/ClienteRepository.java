package pe.edu.vallegrande.proyect.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import pe.edu.vallegrande.proyect.model.Cliente;

import java.util.List;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    List<Cliente> findByEstado(String estado);
    List<Cliente> findAllByOrderByIdAsc();
}
