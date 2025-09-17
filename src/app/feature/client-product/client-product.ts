import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './client-product.html',
  styleUrl: './client-product.scss'
})
export class ClientProduct {
 productos = [
    {
      nombre: 'Bazuka',
      descripcion: 'Controla eficazmente una amplia gama de malezas...',
      precio: 45.99,
      stock: 150,
      categoria: 'Herbicida',
      imagen: 'bazukaa.png'
    },
    {
      nombre: 'Armada',
      descripcion: 'Usado para el control de insectos...',
      precio: 38.50,
      stock: 200,
      categoria: 'Insecticida',
      imagen: 'assets/img/armada.png'
    },
    {
      nombre: 'Fungicida Protector',
      descripcion: 'Fungicida preventivo y curativo...',
      precio: 52.75,
      stock: 120,
      categoria: 'Fungicida',
      imagen: 'assets/img/fungicida.png'
    },
    {
      nombre: 'Urea',
      descripcion: 'Proporciona nitrógeno (46%) esencial...',
      precio: 29.99,
      stock: 300,
      categoria: 'Nutriente',
      imagen: 'assets/img/urea.png'
    },
    {
      nombre: 'Orgabionl',
      descripcion: 'Bioestimulante con aminoácidos...',
      precio: 35.25,
      stock: 180,
      categoria: 'Bioestimulante',
      imagen: 'assets/img/orgabionl.png'
    },
    {
      nombre: 'Dekalb',
      descripcion: 'Semillas adaptadas a condiciones variadas.',
      precio: 42.80,
      stock: 160,
      categoria: 'Semilla',
      imagen: 'assets/img/dekalb.png'
    }
    // Puedes agregar más productos aquí
  ];

  paginaActual = 1;
  itemsPorPagina = 8; // 4x2
  busqueda: string = '';

  get productosFiltrados() {
    if (!this.busqueda.trim()) return this.productos;

    const filtro = this.busqueda.toLowerCase();

    const comienzaCon = this.productos.filter(p =>
      p.nombre.toLowerCase().startsWith(filtro)
    );

    const contiene = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(filtro) &&
      !p.nombre.toLowerCase().startsWith(filtro)
    );

    return [...comienzaCon, ...contiene];
  }

  get totalPaginas(): number {
    return Math.ceil(this.productosFiltrados.length / this.itemsPorPagina);
  }

  get productosPaginados() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.productosFiltrados.slice(inicio, inicio + this.itemsPorPagina);
  }

  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) this.paginaActual++;
  }
  
}
