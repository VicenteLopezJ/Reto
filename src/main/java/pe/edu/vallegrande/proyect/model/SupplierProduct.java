package pe.edu.vallegrande.proyect.model;

import java.math.BigDecimal;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "supplier_products", schema = "APP_PRODUCTS")
public class SupplierProduct {

    public static final String ESTADO_ACTIVO = "A";
    public static final String ESTADO_INACTIVO = "I";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Integer id;

    @Column(name = "products_id")
    private Integer product_id;

    @Column(name = "suppliers_id")
    private Integer suppliers_id;

    @Column(name = "order_quantity")
    private Integer order_quantity;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "subtotal")
    private BigDecimal subtotal;

    @Column(name = "promocion")
    private String promotion;

    @Column(name = "total")
    private BigDecimal total;

    @Column(name = "lead_time_days")
    private Integer lead_time_days;

    @Column(name = "state")
    private String state = ESTADO_ACTIVO;

}
