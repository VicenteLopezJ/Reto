package pe.edu.vallegrande.proyect.service;

import pe.edu.vallegrande.proyect.model.Usuario;
import java.util.List;
import java.util.Optional;

public interface UsuarioService {

    List<Usuario> findAll();

    Optional<Usuario> findById(Long id);

    Usuario save(Usuario usuario);

    Usuario update(Usuario usuario);

    void delete(Long id);

    void deletePermanente(Long id);

    List<Usuario> findByEstado(String estado);

    void restore(Long id);

    Usuario registerSale(Long id, Double amount, Integer quantity);

}