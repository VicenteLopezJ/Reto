package com.example.demo.rest;

import java.util.List;
import java.util.Optional;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Cliente;
import com.example.demo.service.ClienteService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/cliente")
public class ClienteRest {

    private final ClienteService clienteService;

    public ClienteRest(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping
    public List<Cliente> findAll() {
        return clienteService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Cliente> findById(@PathVariable Long id) {
        return clienteService.findById(id);
    }

    @PostMapping("/save")
    public Cliente save(@RequestBody Cliente cliente) {
        return clienteService.save(cliente);
    }

    @PutMapping("/update")
    public Cliente update(@RequestBody Cliente cliente) {
        return clienteService.update(cliente);
    }

    @DeleteMapping("/delete-logico/{id}")
    public String delete(@PathVariable Long id) {
        clienteService.delete(id);
        return "Cliente eliminado lógicamente con ID: " + id;
    }

    @DeleteMapping("/delete-fisico/{id}")
    public String deletePermanente(@PathVariable Long id) {
        clienteService.deletePermanente(id);
        return "Cliente eliminado permanentemente con ID: " + id;
    }

    @PutMapping("/restore/{id}")
    public String restore(@PathVariable Long id) {
        clienteService.restore(id);
        return "Cliente restaurado con ID: " + id;
    }

    @GetMapping("/estado/{estado}")
    public List<Cliente> findByEstado(@PathVariable String estado) {
        return clienteService.findByEstado(estado);
    }
}
