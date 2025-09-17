package pe.edu.vallegrande.proyect.service;

import java.util.List;
import java.util.Optional;

import pe.edu.vallegrande.proyect.model.Cliente;

public interface ClienteService {

    List<Cliente> findAll();

    Optional<Cliente> findById(Long id);

    Cliente save(Cliente cliente);

    Cliente update(Cliente cliente);

    void delete(Long id);

    void deletePermanente(Long id);

    void restore(Long id);

    List<Cliente> findByEstado(String estado);

    byte[] generateJasperPdfReport() throws Exception;

    
}
