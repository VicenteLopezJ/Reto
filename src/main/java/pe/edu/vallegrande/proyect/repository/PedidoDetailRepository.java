package pe.edu.vallegrande.proyect.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.vallegrande.proyect.model.PedidoDetail;

public interface PedidoDetailRepository extends JpaRepository<PedidoDetail, Long> {
    
}
