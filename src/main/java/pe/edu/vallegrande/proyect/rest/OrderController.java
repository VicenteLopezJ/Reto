package pe.edu.vallegrande.proyect.rest;

import pe.edu.vallegrande.proyect.dto.OrderRequest;
import pe.edu.vallegrande.proyect.dto.OrderResponse;
import pe.edu.vallegrande.proyect.model.Order;
import pe.edu.vallegrande.proyect.service.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/v1/api/orders")
@Slf4j
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<Order> findAll() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public Optional<Order> findById(@PathVariable Integer id) {
        return orderService.getOrderById(id);
    }

    @PostMapping("/save")
    public Order save(@RequestBody Order order) {
        return orderService.createOrder(order);
    }

    @PutMapping("/update")
    public Order update(@RequestBody Order order) {
        return orderService.updateOrder(order.getId(), order);
    }

    @PatchMapping("/delete-logico/{id}")
    public String deleteLogico(@PathVariable Integer id) {
        orderService.deleteOrder(id);
        return "Orden marcada como eliminada logicamente (o eliminada fisicamente) con ID: " + id;
    }

    @DeleteMapping("/delete-fisico/{id}")
    public String deletePermanente(@PathVariable Integer id) {
        orderService.deleteOrder(id);
        return "Orden eliminada permanentemente con ID: " + id;
    }

    @PutMapping("/restore/{id}")
    public String restore(@PathVariable Integer id) {
        return "Funcionalidad de restauracion aun no implementada para ordenes con ID: " + id;
    }

    @GetMapping("/status/{status}")
    public List<Order> findByEstado(@PathVariable String status) {
        return orderService.findByStatus(status);
    }

    @GetMapping("/trans")
    public ResponseEntity<byte[]> transaccione() {
        try {
            byte[] pdf = orderService.transaccione();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte_orders.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (Exception e) {
            log.error("Error generando reporte transaccional", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/report/{orderId}")
    public ResponseEntity<byte[]> generateOrderReport(@PathVariable Integer orderId) {
        try {
            byte[] pdf = orderService.generateOrderReportById(orderId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=order_" + orderId + "_report.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (Exception e) {
            log.error("Error generando reporte para orden " + orderId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    
    @PostMapping("/create-transactional")
    public ResponseEntity<?> createOrderWithInventory(@RequestBody OrderRequest orderRequest) {
        try {
            log.info("Recibida solicitud de orden transaccional para cliente ID: {}", orderRequest.getClientId());
            
            // Validaciones basicas del request
            validateOrderRequest(orderRequest);
            
            // Procesar orden de forma transaccional
            OrderResponse response = orderService.createOrderWithInventory(orderRequest);
            
            log.info("Orden transaccional creada exitosamente con ID: {}", response.getOrderId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            log.error("Datos de entrada invalidos: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse(
                "INVALID_REQUEST",
                e.getMessage(),
                System.currentTimeMillis()
            ));
            
        } catch (RuntimeException e) {
            log.error("Error de negocio al crear orden: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse(
                "ORDER_CREATION_FAILED",
                e.getMessage(),
                System.currentTimeMillis()
            ));
            
        } catch (Exception e) {
            log.error("Error interno al crear orden transaccional", e);
            return ResponseEntity.internalServerError().body(new ErrorResponse(
                "INTERNAL_SERVER_ERROR",
                "Error interno del servidor. Contacte al administrador.",
                System.currentTimeMillis()
            ));
        }
    }

    // ========== METODOS AUXILIARES ==========

    /**
     * Valida los datos basicos del request antes de procesarlo
     */
    private void validateOrderRequest(OrderRequest orderRequest) {
        if (orderRequest.getClientId() == null) {
            throw new IllegalArgumentException("Cliente ID es obligatorio");
        }
        
        if (orderRequest.getUserId() == null) {
            throw new IllegalArgumentException("Usuario ID es obligatorio");
        }

        if (orderRequest.getProducts() == null || orderRequest.getProducts().isEmpty()) {
            throw new IllegalArgumentException("La orden debe tener al menos un producto");
        }

        // Validar cada producto
        for (int i = 0; i < orderRequest.getProducts().size(); i++) {
            var product = orderRequest.getProducts().get(i);
            if (product.getProductId() == null) {
                throw new IllegalArgumentException("Producto #" + (i + 1) + " debe tener un ID valido");
            }
            if (product.getQuantity() == null || product.getQuantity() <= 0) {
                throw new IllegalArgumentException("Producto #" + (i + 1) + " debe tener cantidad mayor a 0");
            }
        }
    }

    /**
     * Clase para respuestas de error estructuradas
     */
    public static class ErrorResponse {
        public String errorCode;
        public String message;
        public long timestamp;

        public ErrorResponse(String errorCode, String message, long timestamp) {
            this.errorCode = errorCode;
            this.message = message;
            this.timestamp = timestamp;
        }
    }
}