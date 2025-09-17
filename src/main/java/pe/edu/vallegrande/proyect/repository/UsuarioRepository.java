package pe.edu.vallegrande.proyect.repository;

import pe.edu.vallegrande.proyect.model.Usuario;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> { 
    List<Usuario> findByEstado(String estado);
     List<Usuario> findAllByOrderByIdAsc();
}