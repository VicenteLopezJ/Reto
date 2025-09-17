package pe.edu.vallegrande.proyect.service;

import pe.edu.vallegrande.proyect.dto.OrderRequest;
import pe.edu.vallegrande.proyect.dto.OrderResponse;
import pe.edu.vallegrande.proyect.model.Order;
import java.util.List;
import java.util.Optional;

public interface OrderService {
    
    // ========== MÉTODOS EXISTENTES (se mantienen) ==========
    List<Order> getAllOrders();
    Optional<Order> getOrderById(Integer id);
    Order createOrder(Order order);
    Order updateOrder(Integer id, Order orderDetails);
    void deleteOrder(Integer id);
    List<Order> findByStatus(String status);
    byte[] transaccione() throws Exception;
    byte[] generateOrderReportById(Integer orderId) throws Exception;
    
    // ========== NUEVO MÉTODO TRANSACCIONAL CON DTOs ==========
    /**
     * @param orderRequest 
     * @return 
     * @throws RuntimeException 
     */
    OrderResponse createOrderWithInventory(OrderRequest orderRequest);
    
    // ========== NUEVO MÉTODO PARA OBTENER TODAS LAS ÓRDENES CON DTOs ==========
    /**
     * @return A list of all orders mapped to OrderResponse DTOs.
     */
    List<OrderResponse> getAllOrdersResponse();
}