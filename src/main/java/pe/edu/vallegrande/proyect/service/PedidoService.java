package pe.edu.vallegrande.proyect.service;

import pe.edu.vallegrande.proyect.dto.PurchaseRequest;
import pe.edu.vallegrande.proyect.dto.PurchaseResponse;

public interface PedidoService {

    PurchaseResponse save(PurchaseRequest purchaseRequest);

}