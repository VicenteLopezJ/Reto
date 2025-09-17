// src/main/java/pe/edu/vallegrande/proyect/service/OrderDetailService.java (Optional)
package pe.edu.vallegrande.proyect.service;

import pe.edu.vallegrande.proyect.model.OrderDetail;
import java.util.List;
import java.util.Optional;

public interface OrderDetailService {
    List<OrderDetail> getAllOrderDetails();

    Optional<OrderDetail> getOrderDetailById(Integer id);

    OrderDetail saveOrderDetail(OrderDetail orderDetail);

    void deleteOrderDetail(Integer id);

    List<OrderDetail> getOrderDetailsByOrderId(Integer orderId);
}