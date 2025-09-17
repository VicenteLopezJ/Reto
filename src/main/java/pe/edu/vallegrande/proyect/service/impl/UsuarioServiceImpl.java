package pe.edu.vallegrande.proyect.service.impl;
import pe.edu.vallegrande.proyect.model.Usuario;
import pe.edu.vallegrande.proyect.repository.UsuarioRepository;
import pe.edu.vallegrande.proyect.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Slf4j
@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<Usuario> findAll() {
        log.info("Listando Usuarios:");
        List<Usuario> usuarios = usuarioRepository.findAllByOrderByIdAsc(); 
        usuarios.forEach(u -> System.out.println("Backend - User ID: " + u.getId()));
        return usuarios;
    }

    @Override
    public Optional<Usuario> findById(Long id) {
        log.info("Buscando Usuario por ID: {}", id);
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        usuario.ifPresent(u -> System.out.println("Backend - Found User ID: " + u.getId()));
        return usuario;
    }

    @Override
    public Usuario save(Usuario usuario) {
        log.info("Registrando Usuario: " + usuario.toString());
        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario update(Usuario usuario) {
        log.info("Actualizando Usuario: " + usuario.toString());
        return usuarioRepository.save(usuario);
    }

    @Override
    public void delete(Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        usuario.ifPresent(u -> {
            u.setEstado(Usuario.ESTADO_INACTIVO);
            usuarioRepository.save(u);
        });
    }

    @Override
    public void deletePermanente(Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
        } else {
            log.error("Usuario no encontrado con ID: " + id);
        }
    }

    @Override
    public void restore(Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        usuario.ifPresent(u -> {
            u.setEstado(Usuario.ESTADO_ACTIVO);
            usuarioRepository.save(u);
        });
    }

    @Override
    public List<Usuario> findByEstado(String estado) {
        log.info("Buscando Usuarios por Estado: {}", estado);
        List<Usuario> usuarios = usuarioRepository.findByEstado(estado);
        usuarios.forEach(u -> System.out.println("Backend - User ID (by estado): " + u.getId()));
        return usuarios;
    }

    @Override
    public Usuario registerSale(Long id, Double amount, Integer quantity) { 
        Optional<Usuario> optionalUsuario = usuarioRepository.findById(id);
        if (optionalUsuario.isPresent()) {
            Usuario usuario = optionalUsuario.get();

            usuario.setTotalSales(usuario.getTotalSales() != null ? usuario.getTotalSales() + quantity : quantity);
            BigDecimal currentTotalAmount = usuario.getTotalSaleAmount() != null ? usuario.getTotalSaleAmount() : BigDecimal.ZERO;
            usuario.setTotalSaleAmount(currentTotalAmount.add(BigDecimal.valueOf(amount)));
            usuario.setLastSaleDate(LocalDateTime.now());

            log.info("Registrando venta de S/{} (cantidad: {}) para el usuario ID: {}", amount, quantity, id);
            return usuarioRepository.save(usuario);
        } else {
            log.error("Usuario con ID {} no encontrado para registrar venta.", id);
            throw new RuntimeException("Usuario no encontrado con ID: " + id);
        }
    }
}