package pe.edu.vallegrande.proyect.rest;

import pe.edu.vallegrande.proyect.model.SupplierProduct;
import pe.edu.vallegrande.proyect.service.SupplierProductService;

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

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/v1/api/supplier_product")
public class SupplierProductRest {

    private final SupplierProductService supplierProductService;

    @Autowired
    public SupplierProductRest(SupplierProductService supplierProductService) {
        this.supplierProductService = supplierProductService;
    }

    @GetMapping
    public List<SupplierProduct> findAll() {
        return supplierProductService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<SupplierProduct> findById(@PathVariable Long id) {
        return supplierProductService.findById(id);
    }

    @PostMapping("/save")
    public SupplierProduct save(@RequestBody SupplierProduct supplierProduct) {
        return supplierProductService.save(supplierProduct);
    }

    @PutMapping("/update")
    public SupplierProduct update(@RequestBody SupplierProduct supplierProduct) {
        return supplierProductService.update(supplierProduct);
    }

    @PatchMapping("/delete-logico/{id}")
    public String delete(@PathVariable Long id) {
        supplierProductService.delete(id);
        return "Pedido al proveedor eliminado lógicamente con ID: " + id;
    }

    @PatchMapping("/restore/{id}")
    public String restore(@PathVariable Long id) {
        supplierProductService.restore(id);
        return "Pedido al proveedor restaurado con ID: " + id;
    }

    @GetMapping("/estado/{state}")
    public List<SupplierProduct> findBySystate(@PathVariable String state) {
        return supplierProductService.findByState(state);
    }

    @DeleteMapping("/delete-fisico/{id}")
    public ResponseEntity<String> deletePermanente(@PathVariable Long id) {
        supplierProductService.deletePermanente(id);
        return ResponseEntity.ok("Pedido al proveedor eliminado fisicamente con ID: " + id);
    }

    @GetMapping("/pdf/{id}")
    public ResponseEntity<byte[]> generarReportePorProveedor(@PathVariable("id") Integer id) {
        try {
            byte[] pdf = supplierProductService.generateReportBySupplier(id);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=boleta_proveedor_" + id + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

}
