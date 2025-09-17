import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoForm } from '../producto-form/producto-form';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ProductoService } from '../../../core/services/producto.service';
import { Producto } from '../../../core/interfaces/producto';
@Component({
  selector: 'app-producto-list',
  imports: [CommonModule, FormsModule, ProductoForm],
  templateUrl: './producto-list.html',
  styleUrl: './producto-list.scss'
})
export class ProductoList {
 productoService = inject(ProductoService);
  router = inject(Router);
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  searchTerm = '';
  currentFilter: 'all' | 'active' | 'inactive' = 'active'; // NUEVA PROPIEDAD: Filtro actual ('Activo' por defecto)

  mostrarFormulario = false;
  productoParaEditar: Producto = {
    id: 0,
    name: '',
    brand: '',
    unit_measure: '',
    categories: '',
    unit_price: null,
    expiration_date: '',
    state: 'A'
  };

  displayedColumns: string[] = [
    'id',
    'name',
    'brand',
    'categories',
    'unit_measure',
    'unit_price',
    'expiration_date',
    'state'
  ];

  ngOnInit(): void {
    this.findAll();
  }

  findAll(): void {
    this.productoService.findAll().subscribe(response => {
      this.productos = response;
      this.filtrarProductos(); // <--- CAMBIO: Llama a filtrarProductos después de cargar los datos
    });
  }

  abrirFormulario(): void {
    this.productoParaEditar = {
      id: 0,
      name: '',
      brand: '',
      unit_measure: '',
      categories: '',
      unit_price: null,
      expiration_date: '',
      state: 'A'
    };
    this.mostrarFormulario = true;
  }

  editar(producto: Producto): void {
    this.productoParaEditar = { ...producto };
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
  }

  procesarProductoGuardado(producto: Producto) {
    const productoACrearOActualizar = { ...producto };
    let isNewProduct = productoACrearOActualizar.id === 0;

    if (isNewProduct) {
      delete productoACrearOActualizar.id; // Elimina el ID si es un producto nuevo para que el backend lo genere
    }

    this.productoService.save(productoACrearOActualizar).subscribe({
      next: (res) => {
        Swal.fire({ // ALERTA: Mensaje de éxito al guardar/actualizar
          icon: 'success',
          title: isNewProduct ? '¡Producto Creado!' : '¡Producto Actualizado!',
          text: isNewProduct ? 'El producto ha sido creado exitosamente.' : 'El producto ha sido actualizado exitosamente.',
          showConfirmButton: false,
          timer: 1500
        });
        this.findAll(); // Vuelve a cargar la lista de productos
        this.cerrarFormulario(); // Cierra el formulario
      },
      error: (err) => {
        console.error('Error al guardar producto:', err); // Mantenemos el log para depuración
        Swal.fire({ // ALERTA: Mensaje de error al guardar/actualizar
          icon: 'error',
          title: 'Error al Guardar',
          text: 'No se pudo guardar el producto. Por favor, intente de nuevo.',
        });
      }
    });
  }

  // <--- MODIFICADO: Ahora usa deleteLogico y el flujo de inactivación
  eliminar(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este producto se pondrá como "Inactivo". Podrás activarlo nuevamente si lo deseas.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, inactivar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        // Llama directamente al método de eliminación lógica
        this.productoService.deleteLogico(id).subscribe({
          next: (res) => {
            Swal.fire('¡Inactivado!', 'El producto ha sido marcado como inactivo.', 'success');
            this.findAll(); // Actualiza la lista para reflejar el cambio
          },
          error: (err) => {
            Swal.fire('Error', 'No se pudo inactivar el producto. Por favor, intente de nuevo.', 'error');
            console.error('Error al inactivar:', err);
          }
        });
      }
    });
  }

  // <--- NUEVO MÉTODO: Restaurar producto
  restaurar(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este producto se pondrá como "Activo".',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.productoService.findById(id).subscribe({ // Obtenemos el producto
          next: (productoEncontrado: Producto) => { // Tipado explícito para productoEncontrado
            if (productoEncontrado) {
              productoEncontrado.state = 'A'; // Cambia el estado a Activo
              this.productoService.save(productoEncontrado).subscribe({ // Guardamos (actualizamos) el producto
                next: () => {
                  Swal.fire('¡Restaurado!', 'El producto ha sido marcado como activo.', 'success');
                  this.findAll(); // Actualiza la lista
                },
                error: (err) => {
                  Swal.fire('Error', 'No se pudo restaurar el producto. Por favor, intente de nuevo.', 'error');
                  console.error('Error al restaurar:', err);
                }
              });
            } else {
              Swal.fire('Error', 'Producto no encontrado para restaurar.', 'error');
            }
          },
          error: (err) => {
            Swal.fire('Error', 'No se pudo obtener el producto para restaurar.', 'error');
            console.error('Error al obtener producto para restaurar:', err);
          }
        });
      }
    });
  }

  // NUEVO MÉTODO: Establece el filtro actual y vuelve a filtrar
  setFilter(filter: 'all' | 'active' | 'inactive'): void {
    this.currentFilter = filter;
    this.filtrarProductos();
  }

  // MODIFICADO: Ahora considera el searchTerm Y el currentFilter
  filtrarProductos(): void {
    const term = this.searchTerm.trim().toLowerCase();
    let tempProductos = [...this.productos]; // Trabaja con una copia de todos los productos

    // Primero, aplica el filtro de estado según currentFilter
    if (this.currentFilter === 'active') {
      tempProductos = tempProductos.filter(p => p.state === 'A');
    } else if (this.currentFilter === 'inactive') {
      tempProductos = tempProductos.filter(p => p.state === 'I');
    }

    // Luego, aplica el filtro de búsqueda por texto (si hay un término de búsqueda)
    if (term) {
      this.productosFiltrados = tempProductos.filter(p =>
        p.id?.toString().includes(term) ||
        p.name?.toLowerCase().includes(term) ||
        p.brand?.toLowerCase().includes(term) ||
        p.categories?.toLowerCase().includes(term) ||
        p.unit_measure?.toLowerCase().includes(term) ||
        (term === 'litro' && p.unit_measure === 'L') ||
        (term === 'kilo' && p.unit_measure === 'K')
      );
    } else {
      this.productosFiltrados = tempProductos; // Si no hay término de búsqueda, muestra los productos ya filtrados por estado
    }
  }

  get activosCount(): number {
    return this.productos.filter(p => p.state === 'A').length;
  }

  get inactivosCount(): number {
    return this.productos.filter(p =>
      p.state === 'I').length;
  }

  get totalCount(): number {
    return this.productos.length;
  }

  reportPdf() {
    this.productoService.reportPdf().subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'reporte.pdf'; // nombre temporal
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  goCustomerForm(): void {
    this.router.navigate(['/producto-form']);
  }
}
