package pe.edu.vallegrande.proyect.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class PurchaseResponse {
    
    private Long id;
    private UsuarioDto usuarioId;
    private LocalDateTime pedidoDate;
    private BigDecimal total;
    private String state;
    private List<ProductoDetailDto> products;

    @Data
    public static class UsuarioDto {
        private Long usuarioId;
        private String number_document;
        private String name;
        private String last_name;
    }

    @Data
    public static class ProductoDetailDto {
        private Integer productoId;
        private String name;
        private String brand;
        private BigDecimal unit_price;
        private Integer quantity;
        private BigDecimal subtotal;
    }

}
