package com.example.demo.service.impl;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.example.demo.model.Cliente;
import com.example.demo.repository.ClienteRepository;
import com.example.demo.service.ClienteService;

import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;

@Slf4j
@Service
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;


     @Autowired
    private DataSource datasource;
    
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

    @Override
    public byte[] generateJasperPdfReport() throws Exception {

        InputStream jasperStream = new ClassPathResource("Reports/Blank_A4.jasper").getInputStream();
        HashMap<String, Object> params = new HashMap<>();
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperStream, params, datasource.getConnection());
        log.info("Reporte Jasper en PDF");
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }

}
