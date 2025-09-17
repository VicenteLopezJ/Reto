package pe.edu.vallegrande.proyect.rest;

import pe.edu.vallegrande.proyect.model.Suppliers;
import pe.edu.vallegrande.proyect.service.SuppliersService;

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
@RequestMapping("v1/api/suppliers")
public class SuppliersRest {
    
    private final SuppliersService suppliersService;

    @Autowired
    public SuppliersRest(SuppliersService suppliersService) {
        this.suppliersService = suppliersService;
    }

    @GetMapping
    public List<Suppliers> findAll() {
        return suppliersService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Suppliers> findById(@PathVariable Long id) {
        return suppliersService.findById(id);
    }

    @PostMapping("/save")
    public Suppliers save(@RequestBody Suppliers suppliers) {
        return suppliersService.save(suppliers);
    }

    @PutMapping("/update")
    public Suppliers update(@RequestBody Suppliers suppliers) {
        return suppliersService.update(suppliers);
    }
    
    @PatchMapping("/delete-logico/{id}")
    public String delete(@PathVariable Long id) {
        suppliersService.delete(id);
        return "Proveedor eliminado lógicamente con ID: " + id;
    }

    @PatchMapping("/restore/{id}")
    public String restore(@PathVariable Long id) {
        suppliersService.restore(id);
        return "Proveedor restaurado con ID: " + id;
    }

    @GetMapping("/estado/{state}")
    public List<Suppliers> findBySystate(@PathVariable String state) {
        return suppliersService.findByState(state);
    }

    @DeleteMapping("/delete-fisico/{id}")
    public ResponseEntity<String> deletePermanente(@PathVariable Long id) {
        suppliersService.deletePermanente(id);
        return ResponseEntity.ok("Proveedor eliminado fisicamente con ID: " + id);
    }

}
