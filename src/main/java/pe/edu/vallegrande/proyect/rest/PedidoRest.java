package pe.edu.vallegrande.proyect.rest;

import org.springframework.web.bind.annotation.*;

import pe.edu.vallegrande.proyect.dto.PurchaseRequest;
import pe.edu.vallegrande.proyect.dto.PurchaseResponse;
import pe.edu.vallegrande.proyect.service.PedidoService;

@RestController
@RequestMapping("/v1/api/pedidos")
public class PedidoRest {

    private final PedidoService pedidoService;

    public PedidoRest(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping("/save")
    public PurchaseResponse save(@RequestBody PurchaseRequest purchaseRequest) {
        return pedidoService.save(purchaseRequest);
    }
    
}
