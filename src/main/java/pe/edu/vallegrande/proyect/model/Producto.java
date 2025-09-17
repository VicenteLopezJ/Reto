package pe.edu.vallegrande.proyect.model;

import lombok.Data;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Data
@Table(name = "products", schema = "APP_PRODUCTS")
public class Producto {

    public static final String ESTADO_ACTIVO = "A";
    public static final String ESTADO_INACTIVO = "I";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "categories")
    private String categories;

    @Column(name = "brand")
    private String brand;

    @Column(name = "unit_measure")
    private String unit_measure;

    @Column(name = "unit_price")
    private BigDecimal unit_price;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "expiration_date")
    private LocalDate expiration_date;

    @Column(name = "state")
    private String state = ESTADO_ACTIVO;
}
