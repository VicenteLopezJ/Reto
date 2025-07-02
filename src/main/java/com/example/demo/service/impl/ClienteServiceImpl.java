package com.example.demo.service.impl;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

import com.example.demo.model.Cliente;
import com.example.demo.repository.ClienteRepository;
import com.example.demo.service.ClienteService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;

 
    public ClienteServiceImpl(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Override
    public List<Cliente> findAll() {
        log.info("Listando todos los clientes");
        return clienteRepository.findAll();
    }

    @Override
    public Optional<Cliente> findById(Long id) {
        log.info("Buscando cliente por ID: {}", id);
        return clienteRepository.findById(id);
    }

    @Override
    public Cliente save(Cliente cliente) {
        log.info("Guardando cliente: {}", cliente);
        cliente.setEstado(Cliente.ESTADO_ACTIVO);
        return clienteRepository.save(cliente);
    }

    @Override
    public Cliente update(Cliente cliente) {
        log.info("Actualizando cliente: {}", cliente);
        return clienteRepository.save(cliente);
    }

    @Override
    public void delete(Long id) {
        clienteRepository.findById(id).ifPresent(c -> {
            c.setEstado(Cliente.ESTADO_INACTIVO);
            clienteRepository.save(c);
        });
    }

    @Override
    public void deletePermanente(Long id) {
        if (clienteRepository.existsById(id)) {
            clienteRepository.deleteById(id);
        } else {
            log.warn("Cliente no encontrado para eliminación permanente: ID {}", id);
        }
    }

    @Override
    public void restore(Long id) {
        clienteRepository.findById(id).ifPresent(c -> {
            c.setEstado(Cliente.ESTADO_ACTIVO);
            clienteRepository.save(c);
        });
    }

    @Override
    public List<Cliente> findByEstado(String estado) {
        return clienteRepository.findByEstado(estado);
    }
}
