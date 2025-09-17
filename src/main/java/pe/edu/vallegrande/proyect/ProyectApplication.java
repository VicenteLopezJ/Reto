package pe.edu.vallegrande.proyect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing; // Import this

@SpringBootApplication
@EnableJpaAuditing
public class ProyectApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProyectApplication.class, args);
    }

}