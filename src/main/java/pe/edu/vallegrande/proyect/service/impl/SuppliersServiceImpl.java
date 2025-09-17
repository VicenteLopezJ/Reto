package pe.edu.vallegrande.proyect.service.impl;

import pe.edu.vallegrande.proyect.repository.SuppliersRepository;
import pe.edu.vallegrande.proyect.service.SuppliersService;
import pe.edu.vallegrande.proyect.model.Suppliers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class SuppliersServiceImpl implements SuppliersService {

    private final SuppliersRepository suppliersRepository;

    @Autowired
    public SuppliersServiceImpl(SuppliersRepository suppliersRepository) {
        this.suppliersRepository = suppliersRepository;
    }

    @Override
    public List<Suppliers> findAll() {
        log.info("Listado de los proveedores: ");
        return suppliersRepository.findAll();
    }

    @Override 
    public Optional<Suppliers> findById(Long id) {
        log.info("Listado del proveedor por su ID: ");
        return suppliersRepository.findById(id);
    }

    @Override
    public Suppliers save(Suppliers suppliers) {
        log.info("Registrando al nuevo proveedor: " + suppliers.toString());
        return suppliersRepository.save(suppliers);
    }

    @Override
    public Suppliers update(Suppliers suppliers) {
        log.info("Editando datos del proveedor: " + suppliers.toString());
        return suppliersRepository.save(suppliers); // ya no forzamos estado
    }

    public void deletePermanente(Long id) {
        if (suppliersRepository.existsById(id)) {
            suppliersRepository.deleteById(id); // Elimina el cliente físicamente
        } else {
            log.error("Proveedor no encontrado con ID: " + id);
        }
    }

    @Override
    public void delete(Long id) {
        suppliersRepository.findById(id).ifPresent(suppliers -> {
            suppliers.setState(Suppliers.ESTADO_INACTIVO);
            suppliersRepository.save(suppliers);
        });
    }

    @Override
    public void restore(Long id) {
        suppliersRepository.findById(id).ifPresent(suppliers -> {
            suppliers.setState(Suppliers.ESTADO_ACTIVO);
            suppliersRepository.save(suppliers);
        });
    }

    @Override
    public List<Suppliers> findByState(String state) {
        return suppliersRepository.findByState(state);
    }

}
