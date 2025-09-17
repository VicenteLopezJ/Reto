package pe.edu.vallegrande.proyect.dto;

import java.util.List;
import lombok.Data;

@Data
public class PurchaseRequest {

    private Long UsuarioId;
    private List<ProductoRequest> products;

    @Data
    public static class ProductoRequest {
        private Long productId;
        private Integer quantity;
    }
}