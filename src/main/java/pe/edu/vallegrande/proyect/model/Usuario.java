package pe.edu.vallegrande.proyect.model;

import lombok.Data;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Table;

@Entity
@Data
@Table(name = "usuario") 
public class Usuario {

    public static final String ESTADO_ACTIVO = "A";
    public static final String ESTADO_INACTIVO = "I";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    @Column(name = "name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "document_type")
    private String documentType;

    @Column(name = "number_document")
    private String numberDocument;

    @Column(name = "cell_number")
    private String phoneNumber;

    @Column(name = "email")
    private String email;

    @Column(name = "registration_date")
    private LocalDate registrationDate;

    @Column(name = "address")
    private String address;

    @Column(name = "gender")
    private String gender;

    @Column(name = "total_sales")
    private Integer totalSales;

    @Column(name = "total_sale_amount")
    private BigDecimal totalSaleAmount;

    @Column(name = "last_sales_date")
    private LocalDateTime lastSaleDate;

    @Column(name = "state")
    private String estado = ESTADO_ACTIVO;
}