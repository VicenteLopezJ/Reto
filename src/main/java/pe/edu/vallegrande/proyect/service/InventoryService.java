package pe.edu.vallegrande.proyect.service;

import pe.edu.vallegrande.proyect.model.Inventory;

import java.util.List;
import java.util.Optional;

public interface InventoryService {
    
    List<Inventory> findAll();

    Optional<Inventory> findById(Long id);

    Inventory save(Inventory inventory);

    Inventory update(Inventory inventory);

    void reservado(Long id);

    void dañado(Long id);

    void transicion(Long id);

    void disponible(Long id);

    void deletePermanente(Long id);

    List<Inventory> findByStatus(String status);

}
