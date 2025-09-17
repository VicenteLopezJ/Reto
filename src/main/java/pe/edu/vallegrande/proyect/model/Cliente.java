    package pe.edu.vallegrande.proyect.model;

    import lombok.Data;
    import jakarta.persistence.Entity;
    import jakarta.persistence.GeneratedValue;
    import jakarta.persistence.GenerationType;
    import jakarta.persistence.Id;
    import java.time.LocalDate;


    import jakarta.persistence.Column;
    import jakarta.persistence.Table;

    @Entity
    @Data
    @Table(name = "client")
    public class Cliente {

        public static final String ESTADO_ACTIVO = "A";
        public static final String ESTADO_INACTIVO = "I";

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id")
        private Integer id;

        @Column(name = "name")
        private String firstName;

        @Column(name = "last_name")
        private String lastName;

        @Column(name = "birthday_date")
        private LocalDate  birthdayDate;

        @Column(name = "document_type")
        private String documentType;

        @Column(name = "number_document")
        private String documentNumber;

        @Column(name = "cell_number")
        private Long phoneNumber;

        @Column(name = "email")
        private String email;

        @Column(name = "client_type")
        private String client_type;

        @Column(name = "address")
        private String address;

        @Column(name = "registration_date") 
        private LocalDate registrationDate;

        @Column(name = "is_vip")
        private boolean vip = false;

        @Column(name = "state")
        private String estado = ESTADO_ACTIVO;


    }