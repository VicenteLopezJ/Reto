import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierProductForm } from '../supplier-product-form/supplier-product-form';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SupplierProductService } from '../../../core/services/supplier-product.service';
import { SupplierProduct } from '../../../core/interfaces/supplier-product';

@Component({
  selector: 'app-supplier-product-list',
  imports: [CommonModule, FormsModule, SupplierProductForm],
  templateUrl: './supplier-product-list.html',
  styleUrl: './supplier-product-list.scss'
})
export class SupplierProductList implements OnInit{
supplierProductService = inject(SupplierProductService);
  router = inject(Router);
  supplierProducts: SupplierProduct[] = [];
  supplierProductsFiltrados: SupplierProduct[] = [];
  searchTerm = '';
  currentFilter: 'all' | 'active' | 'inactive' = 'active';

  mostrarFormulario = false;
  supplierProductParaEditar: SupplierProduct = {
    id: undefined, // CAMBIO CLAVE: Inicializar id como undefined para nuevos registros
    product_id: 0,
    suppliers_id: 0,
    order_quantity: 0,
    price: 0,
    subtotal: 0,
    promotion: '',
    total: 0,
    lead_time_days: 0,
    state: 'A'
  };

  displayedColumns: string[] = [
    'id',
    'product_id',
    'suppliers_id',
    'order_quantity',
    'price',
    'subtotal',
    'promotion',
    'total',
    'lead_time_days',
    'state'
  ];

  ngOnInit(): void {
    this.findAll();
  }

  findAll(): void {
    this.supplierProductService.findAll().subscribe(response => {
      this.supplierProducts = response;
      this.filtrarSupplierProducts();
    });
  }

  abrirFormulario(): void {
    this.supplierProductParaEditar = {
      id: undefined, // CAMBIO CLAVE: Asegurarse de que sea undefined al abrir para un nuevo registro
      product_id: 0,
      suppliers_id: 0,
      order_quantity: 0,
      price: 0,
      subtotal: 0,
      promotion: '',
      total: 0,
      lead_time_days: 0,
      state: 'A'
    };
    this.mostrarFormulario = true;
  }

  editar(supplierProduct: SupplierProduct): void {
    this.supplierProductParaEditar = { ...supplierProduct };
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
  }

  procesarSupplierProductGuardado(supplierProduct: SupplierProduct) {
    const supplierProductACrearOActualizar = { ...supplierProduct };
    // La comprobación de isNewSupplierProduct y el borrado de id ya no son estrictamente necesarios
    // si id se inicializa como undefined para nuevos registros, pero se mantiene por seguridad.
    let isNewSupplierProduct = supplierProductACrearOActualizar.id === undefined || supplierProductACrearOActualizar.id === null;

    if (isNewSupplierProduct) {
      delete supplierProductACrearOActualizar.id; // Asegura que el ID no se envíe para la creación
    }

    this.supplierProductService.save(supplierProductACrearOActualizar).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: isNewSupplierProduct ? '¡Pedido de Proveedor Creado!' : '¡Pedido de Proveedor Actualizado!',
          text: isNewSupplierProduct ? 'El pedido de proveedor ha sido creado exitosamente.' : 'El pedido de proveedor ha sido actualizado exitosamente.',
          showConfirmButton: false,
          timer: 1500
        });
        this.findAll();
        this.cerrarFormulario();
      },
      error: (err) => {
        console.error('Error al guardar pedido de proveedor:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error al Guardar',
          text: 'No se pudo guardar el pedido de proveedor. Por favor, intente de nuevo.',
        });
      }
    });
  }

  eliminar(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este pedido de proveedor se pondrá como "Inactivo". Podrás activarlo nuevamente si lo deseas.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, inactivar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.supplierProductService.deleteLogico(id).subscribe({
          next: (res) => {
            Swal.fire('¡Inactivado!', 'El pedido de proveedor ha sido marcado como inactivo.', 'success');
            this.findAll();
          },
          error: (err) => {
            Swal.fire('Error', 'No se pudo inactivar el pedido de proveedor. Por favor, intente de nuevo.', 'error');
            console.error('Error al inactivar:', err);
          }
        });
      }
    });
  }

  restaurar(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este pedido de proveedor se pondrá como "Activo".',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.supplierProductService.restore(id).subscribe({
          next: () => {
            Swal.fire('¡Restaurado!', 'El pedido de proveedor ha sido marcado como activo.', 'success');
            this.findAll();
          },
          error: (err) => {
            Swal.fire('Error', 'No se pudo restaurar el pedido de proveedor. Por favor, intente de nuevo.', 'error');
            console.error('Error al restaurar:', err);
          }
        });
      }
    });
  }

  setFilter(filter: 'all' | 'active' | 'inactive'): void {
    this.currentFilter = filter;
    this.filtrarSupplierProducts();
  }

  filtrarSupplierProducts(): void {
    const term = this.searchTerm.trim().toLowerCase();
    let tempSupplierProducts = [...this.supplierProducts];

    if (this.currentFilter === 'active') {
      tempSupplierProducts = tempSupplierProducts.filter(p => p.state === 'A');
    } else if (this.currentFilter === 'inactive') {
      tempSupplierProducts = tempSupplierProducts.filter(p => p.state === 'I');
    }

    if (term) {
      this.supplierProductsFiltrados = tempSupplierProducts.filter(p =>
        p.id?.toString().includes(term) ||
        p.product_id?.toString().includes(term) ||
        p.suppliers_id?.toString().includes(term) ||
        p.promotion?.toLowerCase().includes(term)
      );
    } else {
      this.supplierProductsFiltrados = tempSupplierProducts;
    }
  }

  get activosCount(): number {
    return this.supplierProducts.filter(p => p.state === 'A').length;
  }

  get inactivosCount(): number {
    return this.supplierProducts.filter(p => p.state === 'I').length;
  }

  get totalCount(): number {
    return this.supplierProducts.length;
  }

  async reportPdf() {
    const { value: supplierId } = await Swal.fire({
      title: 'Generar Reporte PDF',
      input: 'number',
      inputLabel: 'Ingrese el ID del proveedor:',
      inputPlaceholder: 'Ej. 123',
      showCancelButton: true,
      confirmButtonText: 'Generar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || isNaN(Number(value)) || Number(value) <= 0) {
          return 'Por favor, ingrese un ID de proveedor válido (número positivo)';
        }
        return null;
      }
    });

    if (supplierId) {
      this.supplierProductService.generateReportBySupplier(Number(supplierId)).subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `reporte_proveedor_${supplierId}.pdf`;
          link.click();
          URL.revokeObjectURL(url);
          Swal.fire('¡Reporte Generado!', 'El reporte PDF se ha descargado exitosamente.', 'success');
        },
        error: (err) => {
          console.error('Error al generar reporte PDF:', err);
          Swal.fire('Error', 'No se pudo generar el reporte PDF. Asegúrese de que el ID del proveedor sea correcto y el servicio esté disponible.', 'error');
        }
      });
    }
  }
}
