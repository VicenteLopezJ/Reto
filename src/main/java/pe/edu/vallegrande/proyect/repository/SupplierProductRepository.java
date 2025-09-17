package pe.edu.vallegrande.proyect.repository;

import pe.edu.vallegrande.proyect.model.SupplierProduct;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupplierProductRepository extends JpaRepository<SupplierProduct, Long> {
    List<SupplierProduct> findByState(String state);
}