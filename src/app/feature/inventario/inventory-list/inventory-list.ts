import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryForm } from '../inventory-form/inventory-form';
import { InventoryService } from '../../../core/services/inventory.service';
import { Inventory } from '../../../core/interfaces/inventory';

@Component({
  selector: 'app-inventory-list',
  imports: [CommonModule, FormsModule, InventoryForm],
  templateUrl: './inventory-list.html',
  styleUrl: './inventory-list.scss'
})
export class InventoryList implements OnInit{
inventoryService = inject(InventoryService);
  router = inject(Router);
  inventory: Inventory[] = [];
  inventoryFiltrados: Inventory[] = [];
  searchTerm = '';
  currentFilter: 'all' | 'active' | 'inactive' = 'active';
  productIds: number[] = [];

  // ✅ NUEVO: para mostrar el formulario
  mostrarFormulario = false;
  abrirFormulario(): void {
    this.mostrarFormulario = true;
    this.nuevoInventario = {
      products_id: 0,
      quantity_available: 0,
      batch_number: '',
      specs: '',
      location: '',
      entry_date: '',
      last_updated: '',
      status: ''
    };
  }

  nuevoInventario: Inventory = {
    products_id: 0,
    quantity_available: 0,
    batch_number: '',
    specs: '',
    location: '',
    entry_date: '',
    last_updated: '',
    status: ''
  };

  displayedColumns: string[] = [
    'id',
    'products_id',
    'quantity_available',
    'batch_number',
    'specs',
    'location',
    'entry_date',
    'last_updated',
    'status'
  ];

  ngOnInit(): void {
    this.findAll();
  }

  findAll(): void {
    this.inventoryService.findAll().subscribe(response => {
      this.inventory = response;
      this.filtrarInventory();

      // Asignar los IDs una vez que los productos fueron cargados
      this.productIds = response.map(p => p.products_id);
    });
  }

  // NUEVO MÉTODO: Establece el filtro actual y vuelve a filtrar
  setFilter(filter: 'all' | 'active' | 'inactive'): void {
    this.currentFilter = filter;
    this.filtrarInventory();
  }

  filtrarInventory(): void {
    const term = this.searchTerm.trim().toLowerCase();
    let tempInventory = [...this.inventory]; // Trabaja con una copia de todos los productos

    if (this.currentFilter === 'active') {
      tempInventory = tempInventory.filter(p => p.status === 'DIS');
    } else if (this.currentFilter === 'inactive') {
      tempInventory = tempInventory.filter(p => p.status === 'RES' || p.status === 'DAÑ');
    }

    if (term) {
      this.inventoryFiltrados = tempInventory.filter(p =>
        p.products_id.toString().includes(term)
      );
    } else {
      this.inventoryFiltrados = tempInventory;
    }
  }

  get activosCount(): number {
    return this.inventory.filter(p => p.status === 'DIS').length;
  }

  get inactivosCount(): number {
    return this.inventory.filter(p =>
      p.status === 'RES' || p.status === 'DAÑ'
    ).length;
  }

  get totalCount(): number {
    return this.inventory.length;
  }

  // ✅ NUEVO: método para guardar el inventario
  guardarInventario(inventory: Inventory): void {
    console.log('Guardando inventario:', inventory);
    this.inventoryService.save(inventory).subscribe(() => {
      this.findAll(); // recargar la lista
      this.cerrarFormulario(); // ocultar formulario
    });
  }

  // ✅ NUEVO: método para cerrar el formulario
  cerrarFormulario(): void {
    this.mostrarFormulario = false;
  }
}
