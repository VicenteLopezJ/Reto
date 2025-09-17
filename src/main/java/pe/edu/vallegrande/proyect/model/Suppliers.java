package pe.edu.vallegrande.proyect.model;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "suppliers", schema = "APP_PRODUCTS")
public class Suppliers {

    public static final String ESTADO_ACTIVO = "A";
    public static final String ESTADO_INACTIVO = "I";
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "company_name")
    private String company_name;

    @Column(name = "ruc")
    private String ruc;

    @Column(name = "address")
    private String address;

    @Column(name = "gmail")
    private String gmail;

    @Column(name = "cell_number")
    private String cell_number;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "fecha_registro")
    private LocalDate fecha_registro;

    @Column(name = "state")
    private String state = ESTADO_ACTIVO;

}
