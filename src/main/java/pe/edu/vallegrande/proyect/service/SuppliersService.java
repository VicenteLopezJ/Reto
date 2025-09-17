package pe.edu.vallegrande.proyect.service;

import pe.edu.vallegrande.proyect.model.Suppliers;

import java.util.List;
import java.util.Optional;

public interface SuppliersService {

    List<Suppliers> findAll();

    Optional<Suppliers> findById(Long id);

    Suppliers save(Suppliers Suppliers);

    Suppliers update(Suppliers suppliers);

    void delete(Long id);

    void deletePermanente(Long id);

    void restore(Long id);

    List<Suppliers> findByState(String state);

}