package pe.edu.vallegrande.proyect.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import pe.edu.vallegrande.proyect.dto.PurchaseRequest;
import pe.edu.vallegrande.proyect.dto.PurchaseResponse;
import pe.edu.vallegrande.proyect.model.Pedido;
import pe.edu.vallegrande.proyect.model.PedidoDetail;
import pe.edu.vallegrande.proyect.repository.UsuarioRepository;
import pe.edu.vallegrande.proyect.repository.ProductoRepository;
import pe.edu.vallegrande.proyect.repository.PedidoRepository;
import pe.edu.vallegrande.proyect.repository.InventoryRepository;
import pe.edu.vallegrande.proyect.service.PedidoService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PedidoServiceImpl implements PedidoService {

    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final PedidoRepository pedidoRepository;
    private final InventoryRepository inventoryRepository;

    public PedidoServiceImpl(UsuarioRepository usuarioRepository,
                             ProductoRepository productoRepository,
                             PedidoRepository pedidoRepository,
                             InventoryRepository inventoryRepository) {
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
        this.pedidoRepository = pedidoRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse save(PurchaseRequest request) {
        var usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setPedidoDate(java.time.LocalDateTime.now());
        pedido.setState("A");

        List<PedidoDetail> details = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (PurchaseRequest.ProductoRequest pr : request.getProducts()) {
            var producto = productoRepository.findById(pr.getProductId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + pr.getProductId()));

            var inventory = inventoryRepository.findByProductsId(producto.getId())
                    .orElseThrow(() -> new RuntimeException(
                            "Inventario no encontrado para producto: " + producto.getName()));

            // Aumentar stock (pedido a proveedor)
            inventory.setQuantityAvaila(inventory.getQuantityAvaila() + pr.getQuantity());
            inventory.setLastUpdated(java.time.LocalDate.now());
            inventoryRepository.save(inventory);

            // Calcular subtotal
            BigDecimal subtotal = producto.getUnit_price()
                    .multiply(BigDecimal.valueOf(pr.getQuantity()));

            // Crear detalle
            PedidoDetail detail = new PedidoDetail();
            detail.setProducto(producto);
            detail.setQuantity(pr.getQuantity());
            detail.setSubtotal(subtotal);
            detail.setPedido(pedido);
            detail.setState("A");

            details.add(detail);
            total = total.add(subtotal);
        }

        pedido.setTotal(total);
        pedido.setDetails(details);

        Pedido saved = pedidoRepository.save(pedido);
        return toDto(saved);
    }

    private static PurchaseResponse toDto(Pedido pedido) {
        PurchaseResponse dto = new PurchaseResponse();
        dto.setId(pedido.getId());
        dto.setPedidoDate(pedido.getPedidoDate());
        dto.setTotal(pedido.getTotal());
        dto.setState(pedido.getState());

        // Usuario DTO
        PurchaseResponse.UsuarioDto usuarioDto = new PurchaseResponse.UsuarioDto();
        usuarioDto.setUsuarioId(pedido.getUsuario().getId());
        usuarioDto.setNumber_document(pedido.getUsuario().getNumberDocument());
        usuarioDto.setName(pedido.getUsuario().getFirstName());
        usuarioDto.setLast_name(pedido.getUsuario().getLastName());
        dto.setUsuarioId(usuarioDto);

        // Productos DTO
        dto.setProducts(
                pedido.getDetails().stream().map(detail -> {
                    PurchaseResponse.ProductoDetailDto pdDto = new PurchaseResponse.ProductoDetailDto();
                    pdDto.setProductoId(detail.getProducto().getId());
                    pdDto.setName(detail.getProducto().getName());
                    pdDto.setBrand(detail.getProducto().getBrand());
                    pdDto.setUnit_price(detail.getProducto().getUnit_price());
                    pdDto.setQuantity(detail.getQuantity());
                    pdDto.setSubtotal(detail.getSubtotal());
                    return pdDto;
                }).collect(Collectors.toList())
        );

        return dto;
    }
}
