package pe.edu.vallegrande.proyect.service.impl;

import pe.edu.vallegrande.proyect.dto.OrderRequest;
import pe.edu.vallegrande.proyect.dto.OrderResponse;
import pe.edu.vallegrande.proyect.model.*;
import pe.edu.vallegrande.proyect.repository.*;
import pe.edu.vallegrande.proyect.service.OrderService;
import pe.edu.vallegrande.proyect.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;

import java.io.InputStream;
import java.math.BigDecimal;
import java.math.MathContext;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.sql.DataSource;

@Service
@Slf4j
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private DataSource datasource;
    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private ProductoRepository productoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private InventoryRepository inventoryRepository;
    @Autowired
    private UsuarioService usuarioService;

    @Override
    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Order> getOrderById(Integer id) {
        return orderRepository.findById(id);
    }

    @Override
    @Transactional
    public Order createOrder(Order order) {
        if (order.getOrderDetails() != null && !order.getOrderDetails().isEmpty()) {
            order.getOrderDetails().forEach(detail -> detail.setOrder(order));
            calculateOrderTotals(order);
        } else {
            order.setTotalAmount(BigDecimal.ZERO);
        }
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order updateOrder(Integer id, Order updatedOrderData) {
        return orderRepository.findById(id)
                .map(existingOrder -> {
                    existingOrder.setClientId(updatedOrderData.getClientId());
                    existingOrder.setUserId(updatedOrderData.getUserId());
                    existingOrder.setOrderDate(updatedOrderData.getOrderDate());
                    existingOrder.setDeliveryDate(updatedOrderData.getDeliveryDate());
                    existingOrder.setDeliveryAddress(updatedOrderData.getDeliveryAddress());
                    existingOrder.setPaymentMethod(updatedOrderData.getPaymentMethod());
                    existingOrder.setStatus(updatedOrderData.getStatus());
                    existingOrder.setNotes(updatedOrderData.getNotes());
                    existingOrder.getOrderDetails().clear();
                    if (updatedOrderData.getOrderDetails() != null) {
                        updatedOrderData.getOrderDetails().forEach(newDetail -> {
                            newDetail.setOrder(existingOrder);
                            existingOrder.addOrderDetail(newDetail);
                        });
                        calculateOrderTotals(existingOrder);
                    } else {
                        existingOrder.setTotalAmount(BigDecimal.ZERO);
                    }
                    return orderRepository.save(existingOrder);
                }).orElseThrow(() -> new RuntimeException("Order not found with id " + id));
    }

    @Override
    @Transactional
    public void deleteOrder(Integer id) {
        orderRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> findByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    @Override
    public byte[] transaccione() throws Exception {
        InputStream jasperStream = new ClassPathResource("Reports/orders.jasper").getInputStream();
        HashMap<String, Object> params = new HashMap<>();
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperStream, params, datasource.getConnection());
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }

    @Override
    public byte[] generateOrderReportById(Integer orderId) throws Exception {
        InputStream jasperStream = new ClassPathResource("Reports/orders.jasper").getInputStream();
        Map<String, Object> params = new HashMap<>();
        params.put("orderId", orderId);
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperStream, params, datasource.getConnection());
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }

    private void calculateOrderTotals(Order order) {
        BigDecimal orderTotalAmount = BigDecimal.ZERO;
        if (order.getOrderDetails() != null) {
            for (OrderDetail detail : order.getOrderDetails()) {
                BigDecimal quantity = detail.getQuantity() != null ? BigDecimal.valueOf(detail.getQuantity()) : BigDecimal.ZERO;
                BigDecimal unitPrice = detail.getUnitPrice() != null ? detail.getUnitPrice() : BigDecimal.ZERO;
                BigDecimal discount = detail.getDiscount() != null ? detail.getDiscount() : BigDecimal.ZERO;

                BigDecimal subtotal = unitPrice.multiply(quantity);
                BigDecimal discountAmount = subtotal.multiply(discount.divide(BigDecimal.valueOf(100), MathContext.DECIMAL128));
                BigDecimal totalDetail = subtotal.subtract(discountAmount);

                detail.setSubtotal(subtotal);
                detail.setTotal(totalDetail);

                orderTotalAmount = orderTotalAmount.add(totalDetail);
            }
        }
        order.setTotalAmount(orderTotalAmount);
    }

    @Transactional
    @Override
    public OrderResponse createOrderWithInventory(OrderRequest request) {
        var cliente = validateClient(request.getClientId());
        var usuario = validateUser(request.getUserId());
        Order order = createOrderBase(request);
        List<OrderDetail> details = processProducts(request, order);
        Order savedOrder = saveOrderWithDetails(order, details);
        updateUserStats(request.getUserId(), savedOrder);
        
        // Ahora, buscamos el pedido guardado desde la base de datos para asegurarnos de que el DTO
        // refleje los datos generados por la base de datos, como el ID y la fecha de creación.
        Order freshOrder = orderRepository.findById(savedOrder.getId())
                                        .orElseThrow(() -> new RuntimeException("Error al recuperar el pedido recién creado."));
                                        
        return toDto(freshOrder, cliente, usuario);
    }

    private Cliente validateClient(Integer clientId) {
        var cliente = clienteRepository.findById(Long.valueOf(clientId))
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + clientId));
        if (!Cliente.ESTADO_ACTIVO.equals(cliente.getEstado())) {
            throw new RuntimeException("Cliente inactivo");
        }
        return cliente;
    }

    private Usuario validateUser(Integer userId) {
        var usuario = usuarioRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));
        if (!Usuario.ESTADO_ACTIVO.equals(usuario.getEstado())) {
            throw new RuntimeException("Usuario inactivo");
        }
        return usuario;
    }

    private Order createOrderBase(OrderRequest request) {
        Order order = new Order();
        order.setClientId(request.getClientId());
        order.setUserId(request.getUserId());
        order.setOrderDate(LocalDate.now());

        // Nueva lógica para establecer deliveryDate por defecto
        if (request.getDeliveryDate() != null) {
            order.setDeliveryDate(request.getDeliveryDate());
        } else {
            order.setDeliveryDate(LocalDate.now());
        }
        
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setPaymentMethod(request.getPaymentMethod());

        // Use the status from the request, otherwise default to "P"
        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            order.setStatus(request.getStatus());
        } else {
            order.setStatus("P");
        }
        
        order.setNotes(request.getNotes());
        order.setCreatedAt(LocalDateTime.now());
        return order;
    }

    private List<OrderDetail> processProducts(OrderRequest request, Order order) {
        List<OrderDetail> details = new ArrayList<>();
        for (OrderRequest.ProductRequest productRequest : request.getProducts()) {
            var producto = validateProduct(productRequest.getProductId());
            updateInventoryForProduct(productRequest, producto);
            OrderDetail detail = createOrderDetail(productRequest, producto, order);
            details.add(detail);
        }
        return details;
    }

    private Producto validateProduct(Integer productId) {
        var producto = productoRepository.findById(Long.valueOf(productId))
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + productId));
        if (!Producto.ESTADO_ACTIVO.equals(producto.getState())) {
            throw new RuntimeException("Producto inactivo: " + producto.getName());
        }
        return producto;
    }

    private void updateInventoryForProduct(OrderRequest.ProductRequest productRequest, Producto producto) {
        List<Inventory> availableInventory = inventoryRepository.findByStatus(Inventory.ESTADO_DISPONIBLE)
                .stream()
                .filter(inv -> inv.getProductsId().equals(productRequest.getProductId()))
                .collect(Collectors.toList());

        int totalAvailable = availableInventory.stream()
                .mapToInt(Inventory::getQuantityAvaila)
                .sum();

        if (totalAvailable < productRequest.getQuantity()) {
            throw new RuntimeException("Stock insuficiente para: " + producto.getName());
        }

        int remainingToReserve = productRequest.getQuantity();
        for (Inventory inventory : availableInventory) {
            if (remainingToReserve <= 0) break;
            int toReserve = Math.min(inventory.getQuantityAvaila(), remainingToReserve);
            inventory.setQuantityAvaila(inventory.getQuantityAvaila() - toReserve);
            if (inventory.getQuantityAvaila() == 0) {
                inventory.setStatus(Inventory.ESTADO_RESERVADO);
            }
            inventory.setLastUpdated(LocalDate.now());
            inventoryRepository.save(inventory);
            remainingToReserve -= toReserve;
        }
    }

    private OrderDetail createOrderDetail(OrderRequest.ProductRequest productRequest, Producto producto, Order order) {
        BigDecimal unitPrice = productRequest.getUnitPrice() != null ? productRequest.getUnitPrice() : producto.getUnit_price();
        BigDecimal discount = productRequest.getDiscount() != null ? productRequest.getDiscount() : BigDecimal.ZERO;
        BigDecimal quantity = BigDecimal.valueOf(productRequest.getQuantity());
        BigDecimal subtotal = unitPrice.multiply(quantity);
        BigDecimal discountAmount = subtotal.multiply(discount.divide(BigDecimal.valueOf(100), MathContext.DECIMAL128));
        BigDecimal total = subtotal.subtract(discountAmount);

        OrderDetail detail = new OrderDetail();
        detail.setProductId(productRequest.getProductId());
        detail.setQuantity(productRequest.getQuantity());
        detail.setUnitPrice(unitPrice);
        detail.setDiscount(discount);
        detail.setSubtotal(subtotal);
        detail.setTotal(total);
        detail.setComments(productRequest.getComments());
        detail.setOrder(order);

        return detail;
    }

    private Order saveOrderWithDetails(Order order, List<OrderDetail> details) {
        BigDecimal totalAmount = details.stream()
                .map(OrderDetail::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(totalAmount);
        order.setOrderDetails(details);
        return orderRepository.save(order);
    }

    private void updateUserStats(Integer userId, Order savedOrder) {
        int totalQuantity = savedOrder.getOrderDetails().stream()
                .mapToInt(OrderDetail::getQuantity)
                .sum();
        usuarioService.registerSale(Long.valueOf(userId), savedOrder.getTotalAmount().doubleValue(), totalQuantity);
    }

    @Override
    public List<OrderResponse> getAllOrdersResponse() {
        return orderRepository.findAll().stream()
                .map(this::toDtoWithDependencies)
                .collect(Collectors.toList());
    }

    private OrderResponse toDtoWithDependencies(Order order) {
        var cliente = clienteRepository.findById(Long.valueOf(order.getClientId())).orElse(null);
        var usuario = usuarioRepository.findById(Long.valueOf(order.getUserId())).orElse(null);

        OrderResponse dto = new OrderResponse();
        dto.setOrderId(order.getId());
        dto.setOrderDate(order.getOrderDate());
        dto.setDeliveryDate(order.getDeliveryDate());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setNotes(order.getNotes());
        dto.setCreatedAt(order.getCreatedAt());

        if (cliente != null) {
            OrderResponse.ClientDto clientDto = new OrderResponse.ClientDto();
            clientDto.setClientId(cliente.getId().intValue());
            clientDto.setFirstName(cliente.getFirstName());
            clientDto.setLastName(cliente.getLastName());
            clientDto.setDocumentType(cliente.getDocumentType());
            clientDto.setDocumentNumber(cliente.getDocumentNumber());
            clientDto.setEmail(cliente.getEmail());
            clientDto.setVip(cliente.isVip());
            dto.setClient(clientDto);
        }

        if (usuario != null) {
            OrderResponse.UserDto userDto = new OrderResponse.UserDto();
            userDto.setUserId(usuario.getId());
            userDto.setFirstName(usuario.getFirstName());
            userDto.setLastName(usuario.getLastName());
            userDto.setEmail(usuario.getEmail());
            dto.setUser(userDto);
        }

        dto.setProducts(order.getOrderDetails().stream().map(detail -> {
            var producto = productoRepository.findById(Long.valueOf(detail.getProductId())).orElse(null);
            int remainingStock = 0;
            if (producto != null) {
                remainingStock = inventoryRepository.findByStatus(Inventory.ESTADO_DISPONIBLE)
                        .stream()
                        .filter(inv -> inv.getProductsId().equals(detail.getProductId()))
                        .mapToInt(Inventory::getQuantityAvaila)
                        .sum();
            }
            OrderResponse.ProductDetailDto productDto = new OrderResponse.ProductDetailDto();
            productDto.setProductId(detail.getProductId());
            productDto.setName(producto != null ? producto.getName() : "Producto no encontrado");
            productDto.setCategories(producto != null ? producto.getCategories() : "");
            productDto.setBrand(producto != null ? producto.getBrand() : "");
            productDto.setUnitPrice(detail.getUnitPrice());
            productDto.setQuantity(detail.getQuantity());
            productDto.setDiscount(detail.getDiscount());
            productDto.setSubtotal(detail.getSubtotal());
            productDto.setTotal(detail.getTotal());
            productDto.setComments(detail.getComments());
            productDto.setRemainingStock(remainingStock);
            return productDto;
        }).collect(Collectors.toList()));

        return dto;
    }

    private OrderResponse toDto(Order order, Cliente cliente, Usuario usuario) {
        OrderResponse dto = new OrderResponse();
        dto.setOrderId(order.getId());
        dto.setOrderDate(order.getOrderDate());
        dto.setDeliveryDate(order.getDeliveryDate());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setNotes(order.getNotes());
        dto.setCreatedAt(order.getCreatedAt());

        OrderResponse.ClientDto clientDto = new OrderResponse.ClientDto();
        clientDto.setClientId(cliente.getId().intValue());
        clientDto.setFirstName(cliente.getFirstName());
        clientDto.setLastName(cliente.getLastName());
        clientDto.setDocumentType(cliente.getDocumentType());
        clientDto.setDocumentNumber(cliente.getDocumentNumber());
        clientDto.setEmail(cliente.getEmail());
        clientDto.setVip(cliente.isVip());
        dto.setClient(clientDto);

        OrderResponse.UserDto userDto = new OrderResponse.UserDto();
        userDto.setUserId(usuario.getId());
        userDto.setFirstName(usuario.getFirstName());
        userDto.setLastName(usuario.getLastName());
        userDto.setEmail(usuario.getEmail());
        dto.setUser(userDto);

        dto.setProducts(order.getOrderDetails().stream().map(detail -> {
            var producto = productoRepository.findById(Long.valueOf(detail.getProductId())).orElse(null);
            int remainingStock = 0;
            if (producto != null) {
                remainingStock = inventoryRepository.findByStatus(Inventory.ESTADO_DISPONIBLE)
                        .stream()
                        .filter(inv -> inv.getProductsId().equals(detail.getProductId()))
                        .mapToInt(Inventory::getQuantityAvaila)
                        .sum();
            }
            OrderResponse.ProductDetailDto productDto = new OrderResponse.ProductDetailDto();
            productDto.setProductId(detail.getProductId());
            productDto.setName(producto != null ? producto.getName() : "Producto no encontrado");
            productDto.setCategories(producto != null ? producto.getCategories() : "");
            productDto.setBrand(producto != null ? producto.getBrand() : "");
            productDto.setUnitPrice(detail.getUnitPrice());
            productDto.setQuantity(detail.getQuantity());
            productDto.setDiscount(detail.getDiscount());
            productDto.setSubtotal(detail.getSubtotal());
            productDto.setTotal(detail.getTotal());
            productDto.setComments(detail.getComments());
            productDto.setRemainingStock(remainingStock);
            return productDto;
        }).collect(Collectors.toList()));

        return dto;
    }
}