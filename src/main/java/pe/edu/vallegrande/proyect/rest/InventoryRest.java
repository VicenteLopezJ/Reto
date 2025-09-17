package pe.edu.vallegrande.proyect.rest;

import pe.edu.vallegrande.proyect.model.Inventory;
import pe.edu.vallegrande.proyect.service.InventoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/v1/api/inventory")
public class InventoryRest {

    private final InventoryService inventoryService;

    @Autowired
    public InventoryRest(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public List<Inventory> findAll() {
        return inventoryService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Inventory> findById(@PathVariable Long id) {
        return inventoryService.findById(id);
    }
    
    @PostMapping("/save")
    public Inventory save(@RequestBody Inventory inventory) {
        return inventoryService.save(inventory);
    }

    @PutMapping("/update")
    public Inventory update(@RequestBody Inventory inventory) {
        return inventoryService.update(inventory);
    }

    @DeleteMapping("/delete-fisico/{id}")
    public ResponseEntity<String> deletePermanente(@PathVariable Long id) {
        inventoryService.deletePermanente(id);
        return ResponseEntity.ok("Inventario del producto eliminado fisicamente con ID: " + id);
    }

    @PatchMapping("/reservado/{id}")
    public String reservado(@PathVariable Long id) {
        inventoryService.reservado(id);
        return "Inventario del producto esta reservado con ID: " + id;
    }

    @PatchMapping("/transicion/{id}")
    public String transicion(@PathVariable Long id) {
        inventoryService.transicion(id);
        return "Inventario del producto esta en transición con ID: " + id;
    }

    @PatchMapping("/dañado/{id}")
    public String dañado(@PathVariable Long id) {
        inventoryService.dañado(id);
        return "Inventario del producto esta dañado con ID: " + id;
    }

    @PatchMapping("/disponible/{id}")
    public String disponible(@PathVariable Long id) {
        inventoryService.disponible(id);
        return "Inventario del producto esta disponible con ID: " + id;
    }

    @GetMapping("/estado/{status}")
    public List<Inventory> findByState(@PathVariable String status) {
        return inventoryService.findByStatus(status);
    }

}
