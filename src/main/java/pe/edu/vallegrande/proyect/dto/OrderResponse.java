package pe.edu.vallegrande.proyect.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {

    private Integer orderId;
    private ClientDto client;
    private UserDto user;
    private LocalDate orderDate;
    private LocalDate deliveryDate;
    private String deliveryAddress;
    private String paymentMethod;
    private BigDecimal totalAmount;
    private String status;
    private String notes;
    private LocalDateTime createdAt;
    private List<ProductDetailDto> products;

    // --- Cliente ---
    @Data
    public static class ClientDto {
        private Integer clientId;
        private String firstName;
        private String lastName;
        private String documentType;  
        private String documentNumber; 
        private String email;
        private boolean vip;
    }

    // --- Usuario/Vendedor ---
    @Data
    public static class UserDto {
        private Long userId;
        private String firstName;
        private String lastName;
        private String email;
    }

    // --- Detalle de producto ---
    @Data
    public static class ProductDetailDto {
        private Integer productId;
        private String name;
        private String categories;
        private String brand;
        private BigDecimal unitPrice;
        private Integer quantity;
        private BigDecimal discount;
        private BigDecimal subtotal;
        private BigDecimal total;
        private String comments;
        private Integer remainingStock; 
    }
}
