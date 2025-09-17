package pe.edu.vallegrande.proyect.service.impl;

import pe.edu.vallegrande.proyect.model.Producto;
import pe.edu.vallegrande.proyect.repository.ProductoRepository;
import pe.edu.vallegrande.proyect.service.ProductoService;
import javax.sql.DataSource;

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

@Slf4j
@Service
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;

    @Autowired
    private DataSource datasource;

    @Autowired
    public ProductoServiceImpl(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @Override
    public List<Producto> findAll() {
        log.info("Listando de los productos: ");
        return productoRepository.findAll();
    }

    @Override
    public Optional<Producto> findById(Long id) {
        log.info("Listando el producto ID: ");
        return productoRepository.findById(id);
    }

    @Override
    public Producto save(Producto producto) {
        log.info("Registrando nuevo producto: " + producto.toString());
        return productoRepository.save(producto);
    }

    @Override
    public Producto update(Producto producto) {
        log.info("Actualizando datos del producto: " + producto.toString());
        return productoRepository.save(producto);
    }

    public void deletePermanente(Long id) {
        if (productoRepository.existsById(id)) {
            productoRepository.deleteById(id);
        } else {
            log.error("Producto no encontrado con ID: " + id);
        }
    }

    @Override
    public void delete(Long id) {
        productoRepository.findById(id).ifPresent(producto -> {
            producto.setState(Producto.ESTADO_INACTIVO);
            productoRepository.save(producto);
        });
    }

    @Override
    public void restore(Long id) {
        productoRepository.findById(id).ifPresent(producto -> {
            producto.setState(Producto.ESTADO_ACTIVO);
            productoRepository.save(producto);
        });
    }

    @Override
    public List<Producto> findByState(String state) {
        return productoRepository.findByState(state);
    }

    @Override
    public byte[] generateJasperPdfReport() throws Exception {
        // Cargar archivo .jasper en src/main/resources/reports (SIN USAR IMÁGENES EN EL JASPER)
        InputStream jasperStream = new ClassPathResource("reports/reportmaestrap.jasper").getInputStream();
        // Sin parámetros
        HashMap<String, Object> params = new HashMap<>();
        // Llenar reporte con conexión a Oracle Cloud con application.yml | aplicación.properties
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperStream, params, datasource.getConnection());
        // Exportar a PDF
        log.info("Reporte Jasper en PDF");
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }

}
