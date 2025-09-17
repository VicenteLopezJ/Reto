package pe.edu.vallegrande.proyect.service;

import java.util.List;
import java.util.Optional;

import pe.edu.vallegrande.proyect.model.SupplierProduct;

public interface SupplierProductService {
    
    List<SupplierProduct> findAll();

    Optional<SupplierProduct> findById(Long id);

    SupplierProduct save(SupplierProduct supplierProduct);

    SupplierProduct update(SupplierProduct supplierProduct);

    void delete(Long id);

    void deletePermanente(Long id);

    void restore(Long id);

    List<SupplierProduct> findByState(String state);

    byte[] generateReportBySupplier(Integer supplierId) throws Exception;

}
