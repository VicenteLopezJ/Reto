package pe.edu.vallegrande.proyect.model;

import lombok.Data;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Data
@Table(name = "inventory", schema = "APP_PRODUCTS")

public class Inventory {

    public static final String ESTADO_DISPONIBLE = "DIS";
    public static final String ESTADO_RESERVADO = "RES";
    public static final String ESTADO_TRANSICION = "TRA";
    public static final String ESTADO_DAÑADO = "DAÑ";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "products_id")
    private Integer productsId;

    @Column(name = "quantity_available")
    private Integer quantityAvaila;

    @Column(name = "batch_number")
    private String batchNumber;

    @Column(name = "specs")
    private String specs;

    @Column(name = "location")
    private String location;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "entry_date")
    private LocalDate entry_date;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "last_updated")
    private LocalDate lastUpdated;

    @Column(name = "status")
    private String status = ESTADO_DISPONIBLE;

}
