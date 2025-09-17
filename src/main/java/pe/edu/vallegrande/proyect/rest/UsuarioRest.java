package pe.edu.vallegrande.proyect.rest;

import pe.edu.vallegrande.proyect.model.Usuario;
import pe.edu.vallegrande.proyect.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/v1/api/usuarios")
public class UsuarioRest {

    private final UsuarioService usuarioService;

    @Autowired
    public UsuarioRest(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<Usuario> findAll() {
        return usuarioService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Usuario> findById(@PathVariable Long id) {
        return usuarioService.findById(id);
    }

    @PostMapping("/save")
    public Usuario save(@RequestBody Usuario usuario) {
        return usuarioService.save(usuario);
    }

    @PutMapping("/update")
    public Usuario update(@RequestBody Usuario usuario) {
        return usuarioService.update(usuario);
    }

    @PatchMapping("/delete-logico/{id}")
    public String delete(@PathVariable Long id) {
        usuarioService.delete(id);
        return "Usuario eliminado lógicamente con ID: " + id;
    }

    @DeleteMapping("/delete-fisico/{id}")
    public String deletePermanente(@PathVariable Long id) {
        usuarioService.deletePermanente(id);
        return "Usuario eliminado permanentemente con ID: " + id;
    }

    @GetMapping("/estado/{estado}")
    public List<Usuario> findByEstado(@PathVariable String estado) {
        return usuarioService.findByEstado(estado);
    }

    @PutMapping("/restore/{id}")
    public String restore(@PathVariable Long id) {
        usuarioService.restore(id);
        return "Usuario restaurado con ID: " + id;
    }

    @PutMapping("/register-sale/{id}")
    public ResponseEntity<Usuario> registerSale(@PathVariable Long id, @RequestBody Map<String, Object> payload) {

        Double amount = null;
        Integer quantity = null;

        if (payload.get("saleAmount") instanceof Number) {
            amount = ((Number) payload.get("saleAmount")).doubleValue();
        }
        if (payload.get("quantity") instanceof Number) {
            quantity = ((Number) payload.get("quantity")).intValue();
        }

        if (amount == null || quantity == null) {
            return ResponseEntity.badRequest().body(null);
        }

        try {
  
            Usuario updatedUser = usuarioService.registerSale(id, amount, quantity);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            System.err.println("Error al registrar venta: " + e.getMessage()); // Log the actual error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}