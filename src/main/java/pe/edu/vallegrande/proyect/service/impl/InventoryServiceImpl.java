package pe.edu.vallegrande.proyect.service.impl;

import pe.edu.vallegrande.proyect.model.Inventory;
import pe.edu.vallegrande.proyect.repository.InventoryRepository;
import pe.edu.vallegrande.proyect.service.InventoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class InventoryServiceImpl implements InventoryService {
    
    private final InventoryRepository inventoryRepository;

    @Autowired
    public InventoryServiceImpl(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    @Override
    public List<Inventory> findAll() {
        log.info("Listando del inventarios de los productos: ");
        return inventoryRepository.findAll();
    }

    @Override
    public Optional<Inventory> findById(Long id) {
        log.info("Listando del inventario del producto por ID: ");
        return inventoryRepository.findById(id);
    }

    @Override
    public Inventory save(Inventory inventory) {
        log.info("Registrando el inventario del nuevo producto: " + inventory.toString());
        return inventoryRepository.save(inventory);
    }

    @Override
    public Inventory update(Inventory inventory) {
        log.info("Actualizando del inventario del producto: " + inventory.toString());
        return inventoryRepository.save(inventory);
    }

    public void deletePermanente(Long id) {
        if (inventoryRepository.existsById(id)) {
            inventoryRepository.deleteById(id);
        } else {
            log.error("Inverntario del producto no encontrado con ID: " + id);
        }
    }

    @Override
    public void reservado(Long id) {
        inventoryRepository.findById(id).ifPresent(inventory -> {
            inventory.setStatus(Inventory.ESTADO_RESERVADO);
            inventoryRepository.save(inventory);
        });
    }

    @Override
    public void transicion(Long id) {
        inventoryRepository.findById(id).ifPresent(inventory -> {
            inventory.setStatus(Inventory.ESTADO_TRANSICION);
            inventoryRepository.save(inventory);
        });
    }

    @Override
    public void dañado(Long id) {
        inventoryRepository.findById(id).ifPresent(inventory -> {
            inventory.setStatus(Inventory.ESTADO_DAÑADO);
            inventoryRepository.save(inventory);
        });
    }

    @Override
    public void disponible(Long id) {
        inventoryRepository.findById(id).ifPresent(inventory -> {
            inventory.setStatus(Inventory.ESTADO_DISPONIBLE);
            inventoryRepository.save(inventory);
        });
    }

    @Override
    public List<Inventory> findByStatus(String status) {
        return inventoryRepository.findByStatus(status);
    }

}
