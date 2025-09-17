package pe.edu.vallegrande.proyect.repository;

import pe.edu.vallegrande.proyect.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findByStatus(String status);

    Optional<Inventory> findByProductsId(Integer productsId);
}
