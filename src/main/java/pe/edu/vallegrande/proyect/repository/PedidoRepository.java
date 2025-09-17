package pe.edu.vallegrande.proyect.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.vallegrande.proyect.model.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    
}
