package pe.edu.vallegrande.proyect.dto;

// File: pe.edu.vallegrande.proyect.dto.OrderRequest.java

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class OrderRequest {

    private Integer clientId;
    private Integer userId;
    private LocalDate deliveryDate;
    private String deliveryAddress;
    private String paymentMethod;
    private String notes;
    private String status; 
    private List<ProductRequest> products;

    @Data
    public static class ProductRequest {
        private Integer productId;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal discount;
        private String comments;
    }
}