import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from '../../../core/interfaces/cliente';
import { ClienteService } from '../../../core/services/cliente.service';
import { ClienteForm } from '../cliente-form/cliente-form';

import Swal from 'sweetalert2';

import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
@Component({
  selector: 'app-cliente-list',
  imports: [CommonModule,
    FormsModule,
    ClienteForm,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatChipsModule,],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.scss'
})
export class ClienteList implements OnInit{
clienteService = inject(ClienteService);
  router = inject(Router);

  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  clientesPorPagina: number = 5;
  paginaActual: number = 1;
  totalPaginas: number = 1;

  searchTerm: string = '';
  mostrarFormulario: boolean = false;
  editando: boolean = false;
  currentFilterStatus: 'all' | 'Activo' | 'Inactivo' = 'Activo';

  nuevoCliente: Cliente = {
    id: 0,
    firstName: '',
    lastName: '',
    birthdayDate: '',
    documentType: 'DNI',
    documentNumber: '',
    phoneNumber: 0,
    email: '',
    client_type: 'Minorista',
    address: '',
    registrationDate: new Date(),
    vip: false,
    estado: 'A',
  };

  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'birthdayDate',
    'documentType',
    'documentNumber',
    'email',
    'phoneNumber',
    'client_type',
    'address',
    'registrationDate',
    'vip',
    'estado',
    'acciones',
  ];

  ngOnInit(): void {
    this.cargarClientes();
  }

  reportPdf(): void {
    this.clienteService.reportPdf().subscribe((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'clientes.pdf'; 
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  cargarClientes(): void {
    this.clienteService.findAll().subscribe({
      next: (data) => {
        console.log('Clientes recibidos del backend:', data);
        this.clientes = data;
        this.aplicarFiltros();
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        Swal.fire('Error', 'No se pudieron cargar los clientes.', 'error');
      },
    });
  }
  aplicarFiltros(): void {
    let tempClientes = this.clientes;
    if (this.currentFilterStatus === 'Activo') {
      tempClientes = tempClientes.filter((cliente) => cliente.estado === 'A');
    } else if (this.currentFilterStatus === 'Inactivo') {
      tempClientes = tempClientes.filter((cliente) => cliente.estado === 'I');
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      tempClientes = tempClientes.filter(
        (cliente) =>
          cliente.firstName.toLowerCase().includes(term) ||
          cliente.lastName.toLowerCase().includes(term) ||
          cliente.documentNumber.includes(term) ||
          (cliente.email && cliente.email.toLowerCase().includes(term)) ||
          (cliente.address && cliente.address.toLowerCase().includes(term))
      );
    }

    this.totalPaginas = Math.ceil(tempClientes.length / this.clientesPorPagina);

    if (this.totalPaginas === 0) {
      this.paginaActual = 1;
    } else if (this.paginaActual > this.totalPaginas) {
      this.paginaActual = this.totalPaginas;
    } else if (this.paginaActual < 1) {
      this.paginaActual = 1;
    }

    this.clientesFiltrados = tempClientes.slice(
      (this.paginaActual - 1) * this.clientesPorPagina,
      this.paginaActual * this.clientesPorPagina
    );
  }

  filtrarClientes(): void {
    this.aplicarFiltros();
  }

  cambiarFiltroEstado(status: 'all' | 'Activo' | 'Inactivo'): void {
    this.currentFilterStatus = status;
    this.paginaActual = 1;
    this.aplicarFiltros();
  }

  cambiarPagina(pagina: number): void {
    if (pagina > 0 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.aplicarFiltros();
    }
  }

  abrirFormulario(cliente: Cliente | null = null): void {
    if (cliente) {
      this.nuevoCliente = { ...cliente };
      this.editando = true;
    } else {
      this.nuevoCliente = {
        id: 0,
        firstName: '',
        lastName: '',
        birthdayDate: '',
        documentType: 'DNI',
        documentNumber: '',
        phoneNumber: 0,
        email: '',
        client_type: 'Minorista',
        address: '',
        registrationDate: new Date(),
        vip: false,
        estado: 'A',
      };
      this.editando = false;
    }
    this.mostrarFormulario = true;
  }

  procesarClienteGuardado(cliente: Cliente): void {
    if (this.editando) {
      // Removed confirmation dialog for saving/updating
      console.log('Cliente a actualizar:', cliente);
      this.clienteService.update(cliente).subscribe({
        next: (clienteActualizado) => {
          const index = this.clientes.findIndex(
            (c) => c.id === clienteActualizado.id
          );
          if (index !== -1) {
            this.clientes[index] = clienteActualizado;
            this.aplicarFiltros();
            this.cerrarFormulario();
            Swal.fire(
              'Guardado!',
              'El cliente ha sido actualizado.',
              'success'
            );
          }
        },
        error: (err) => {
          console.error('Error al actualizar el cliente:', err);
          Swal.fire('Error', 'No se pudo actualizar el cliente.', 'error');
        },
      });
    } else {
      this.clienteService.save(cliente).subscribe({
        next: (clienteNuevo) => {
          this.clientes.push(clienteNuevo);
          this.aplicarFiltros();
          this.cerrarFormulario();
          Swal.fire(
            'Cliente Añadido',
            'El cliente ha sido añadido correctamente.',
            'success'
          );
        },
        error: (err) => {
          console.error('Error al añadir el cliente:', err);
          Swal.fire('Error', 'No se pudo añadir el cliente.', 'error');
        },
      });
    }
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.nuevoCliente = {
      id: 0,
      firstName: '',
      lastName: '',
      birthdayDate: '',
      documentType: 'DNI',
      documentNumber: '',
      phoneNumber: 0,
      email: '',
      client_type: 'Minorista',
      address: '',
      registrationDate: new Date(),
      vip: false,
      estado: 'A',
    };
  }

  eliminarCliente(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este cliente sera eliminado logicamente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, marcar como inactivo',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const clienteParaInactivar = this.clientes.find(
          (cliente) => cliente.id === id
        );
        if (clienteParaInactivar) {
          const updatedCliente = { ...clienteParaInactivar, estado: 'I' };
          this.clienteService.update(updatedCliente).subscribe({
            next: (clienteActualizado) => {
              const index = this.clientes.findIndex(
                (c) => c.id === clienteActualizado.id
              );
              if (index !== -1) {
                this.clientes[index] = clienteActualizado;
              }
              this.aplicarFiltros();
              Swal.fire(
                'Inactivo!',
                'El cliente ha sido marcado como inactivo.',
                'success'
              );
            },
            error: (err) => {
              console.error('Error al marcar el cliente como inactivo:', err);
              Swal.fire(
                'Error',
                'No se pudo marcar el cliente como inactivo.',
                'error'
              );
            },
          });
        } else {
          Swal.fire('Error', 'Cliente no encontrado para inactivar.', 'error');
        }
      }
    });
  }

  restaurarCliente(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este cliente será marcado como activo.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const clienteParaRestaurar = this.clientes.find(
          (cliente) => cliente.id === id
        );
        if (clienteParaRestaurar) {
          const updatedCliente = { ...clienteParaRestaurar, estado: 'A' };
          this.clienteService.update(updatedCliente).subscribe({
            next: (clienteActualizado) => {
              const index = this.clientes.findIndex(
                (c) => c.id === clienteActualizado.id
              );
              if (index !== -1) {
                this.clientes[index] = clienteActualizado;
              }
              this.aplicarFiltros();
              Swal.fire(
                'Restaurado!',
                'El cliente ha sido restaurado y está activo.',
                'success'
              );
            },
            error: (err) => {
              console.error('Error al restaurar el cliente:', err);
              Swal.fire('Error', 'No se pudo restaurar el cliente.', 'error');
            },
          });
        } else {
          Swal.fire('Error', 'Cliente no encontrado para restaurar.', 'error');
        }
      }
    });
  }
}
