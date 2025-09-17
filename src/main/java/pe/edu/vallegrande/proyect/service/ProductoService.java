package pe.edu.vallegrande.proyect.service;

import pe.edu.vallegrande.proyect.model.Producto;

import java.util.List;
import java.util.Optional;

public interface ProductoService {

    List<Producto> findAll();

    Optional<Producto> findById(Long id);

    Producto save(Producto producto);

    Producto update(Producto producto);

    void delete(Long id);

    void deletePermanente(Long id);

    void restore(Long id);

    List<Producto> findByState(String state);

    byte[] generateJasperPdfReport() throws Exception;
    
}