package pe.edu.vallegrande.proyect.service.impl;

import pe.edu.vallegrande.proyect.model.Cliente;
import pe.edu.vallegrande.proyect.repository.ClienteRepository;
import pe.edu.vallegrande.proyect.service.ClienteService;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;

import java.util.List;
import java.util.Optional;
import java.io.InputStream;
import java.util.HashMap;

@Slf4j
@Service
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;

    @Autowired
    private DataSource datasource;

    @Autowired
    public ClienteServiceImpl(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Override
    public List<Cliente> findAll() {
        log.info("Listando Datos: ");
        return clienteRepository.findAllByOrderByIdAsc();
    }

    @Override
    public Optional<Cliente> findById(Long id) {
        log.info("Listando Datos por ID: ");
        return clienteRepository.findById(id);
    }

    @Override
    public Cliente save(Cliente cliente) {
        log.info("Registrando Datos: " + cliente.toString());
        return clienteRepository.save(cliente);
    }

    @Override
    public Cliente update(Cliente cliente) {
        log.info("Editando Datos: " + cliente.toString());
        return clienteRepository.save(cliente);
    }

    @Override
    public void delete(Long id) {
        Optional<Cliente> cliente = clienteRepository.findById(id);
        cliente.ifPresent(c -> {
            c.setEstado(Cliente.ESTADO_INACTIVO);
            clienteRepository.save(c);
        });
    }

    public void deletePermanente(Long id) {
        if (clienteRepository.existsById(id)) {
            clienteRepository.deleteById(id);
        } else {
            log.error("Cliente no encontrado con ID: " + id);
        }
    }

    @Override
    public void restore(Long id) {
        Optional<Cliente> cliente = clienteRepository.findById(id);
        cliente.ifPresent(c -> {
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

        InputStream jasperStream = new ClassPathResource("Reports/reportCliente.jasper").getInputStream();
        HashMap<String, Object> params = new HashMap<>();
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperStream, params, datasource.getConnection());
        log.info("Reporte Jasper en PDF");
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }


    
}