package pe.edu.vallegrande.proyect.service.impl;

import pe.edu.vallegrande.proyect.model.SupplierProduct;
import pe.edu.vallegrande.proyect.repository.SupplierProductRepository;
import pe.edu.vallegrande.proyect.service.SupplierProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import javax.sql.DataSource;

@Slf4j
@Service
public class SupplierProductServiceImpl implements SupplierProductService {

    private final SupplierProductRepository supplierProductRepository;

    @Autowired
    private DataSource datasource;

    @Autowired
    public SupplierProductServiceImpl(SupplierProductRepository supplierProductRepository) {
        this.supplierProductRepository = supplierProductRepository;
    }

    @Override
    public List<SupplierProduct> findAll() {
        log.info("Listado de los pedidos a los proveedores");
        return supplierProductRepository.findAll();
    }

    @Override
    public Optional<SupplierProduct> findById(Long id) {
        log.info("Listando de pedidos a los proveedores por ID: ");
        return supplierProductRepository.findById(id);
    }

    @Override
    public SupplierProduct save(SupplierProduct supplierProduct) {
        log.info("Registrando pedidos a los proveedores: " + supplierProduct.toString());
        return supplierProductRepository.save(supplierProduct);
    }

    @Override
    public SupplierProduct update(SupplierProduct supplierProduct) {
        log.info("Actualizando el pedido al proveedor: " + supplierProduct.toString());
        return supplierProductRepository.save(supplierProduct);
    }

    @Override
    public void deletePermanente(Long id) {
        if (supplierProductRepository.existsById(id)) {
            supplierProductRepository.deleteById(id);
        } else {
            log.error("Pedido al proveedor no encontrado con ID: " + id);
        }
    }

    @Override
    public void delete(Long id) {
        supplierProductRepository.findById(id).ifPresent(supplierProduct -> {
            supplierProduct.setState(SupplierProduct.ESTADO_INACTIVO);
            supplierProductRepository.save(supplierProduct);
        });
    }

    @Override
    public void restore(Long id) {
        supplierProductRepository.findById(id).ifPresent(supplierProduct -> {
            supplierProduct.setState(SupplierProduct.ESTADO_ACTIVO);
            supplierProductRepository.save(supplierProduct);
        });
    }

    @Override
    public List<SupplierProduct> findByState(String state) {
        return supplierProductRepository.findByState(state);
    }

    @Override
    public byte[] generateReportBySupplier(Integer supplierId) throws Exception {
        InputStream reportStream = new ClassPathResource("Reports/reporteTransacional.jasper").getInputStream();
        HashMap<String, Object> params = new HashMap<>();
        params.put("supplier_id", supplierId);
        JasperPrint jasperPrint = JasperFillManager.fillReport(reportStream, params, datasource.getConnection());
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }

}
