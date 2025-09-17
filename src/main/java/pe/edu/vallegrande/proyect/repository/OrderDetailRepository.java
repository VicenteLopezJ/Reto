package pe.edu.vallegrande.proyect.repository;

import pe.edu.vallegrande.proyect.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; 

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    List<OrderDetail> findByOrder_Id(Integer orderId); 
    List<OrderDetail> findAllByOrderByIdAsc();
}