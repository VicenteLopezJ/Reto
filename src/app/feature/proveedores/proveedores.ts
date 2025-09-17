import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedores',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './proveedores.html',
  styleUrl: './proveedores.scss'
})
export class Proveedores implements OnInit  {
busqueda: string = '';
  proveedorEditado: any = null;
  nuevoProveedor: any = null;
  paginaActual: number = 1;
  proveedoresPorPagina: number = 5;

  proveedores = [
    {
      id: 1,
      empresa: 'AgroInsumos S.A.',
      ruc: '12345678901',
      correo: 'contacto@agroinsumos.com',
      telefono: '987654324',
      estado: 'Activo',
    },
    {
      id: 2,
      empresa: 'QuímicosAgro Ltda.',
      ruc: '12345678902',
      correo: 'ventas@quimicosagro.com',
      telefono: '987654325',
      estado: 'Activo',
    },
    {
      id: 3,
      empresa: 'Fertilizantes del Sur',
      ruc: '20123456789',
      correo: 'info@fertilizantesdelsur.com',
      telefono: '987123456',
      estado: 'Activo',
    },
    {
      id: 4,
      empresa: 'Agro Químicos Nacionales',
      ruc: '20987654321',
      correo: 'ventas@agroquimicosnacionales.com',
      telefono: '987456123',
      estado: 'Activo',
    },
    {
      id: 5,
      empresa: 'Semillas Premium',
      ruc: '20567891234',
      correo: 'contacto@semillaspremium.com',
      telefono: '987789456',
      estado: 'Inactivo',
    },
    {
      id: 6,
      empresa: 'NutriAgro S.R.L.',
      ruc: '20458963217',
      correo: 'info@nutriagro.com',
      telefono: '984123789',
      estado: 'Activo',
    },
    {
      id: 7,
      empresa: 'BioAgroTech',
      ruc: '20874512365',
      correo: 'ventas@bioagrotech.com',
      telefono: '982345678',
      estado: 'Activo',
    },
    {
      id: 8,
      empresa: 'AgroVet Perú',
      ruc: '20789654123',
      correo: 'agrovet@contacto.com',
      telefono: '981234567',
      estado: 'Inactivo',
    },
    {
      id: 9,
      empresa: 'GreenChemicals',
      ruc: '20567812345',
      correo: 'green@chemicals.com',
      telefono: '980112233',
      estado: 'Activo',
    },
    {
      id: 10,
      empresa: 'Fertilizantes Andinos',
      ruc: '20654321987',
      correo: 'info@fertilizantesandinos.com',
      telefono: '979876543',
      estado: 'Activo',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  proveedoresFiltrados() {
    let filtrados = this.proveedores;

    if (this.busqueda && this.busqueda.trim() !== '') {
      const filtro = this.busqueda.toLowerCase();
      filtrados = filtrados.filter(
        (proveedor) =>
          proveedor.empresa.toLowerCase().includes(filtro) ||
          proveedor.ruc.includes(filtro) ||
          proveedor.correo.toLowerCase().includes(filtro) ||
          proveedor.telefono.includes(filtro)
      );
    }

    const inicio = (this.paginaActual - 1) * this.proveedoresPorPagina;
    const fin = inicio + this.proveedoresPorPagina;

    return filtrados.slice(inicio, fin);
  }

  totalPaginas(): number {
    const total =
      this.busqueda && this.busqueda.trim() !== ''
        ? this.proveedores.filter(
            (p) =>
              p.empresa.toLowerCase().includes(this.busqueda.toLowerCase()) ||
              p.ruc.includes(this.busqueda) ||
              p.correo.toLowerCase().includes(this.busqueda.toLowerCase()) ||
              p.telefono.includes(this.busqueda)
          ).length
        : this.proveedores.length;

    return Math.ceil(total / this.proveedoresPorPagina);
  }

  
  editarProveedor(proveedor: any) {
    this.proveedorEditado = { ...proveedor };
  }

  guardarProveedor(formulario: any) {
    if (formulario.valid) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas guardar los cambios del proveedor?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          const index = this.proveedores.findIndex(
            (p) => p.id === this.proveedorEditado.id
          );
          if (index !== -1) {
            this.proveedores[index] = { ...this.proveedorEditado };
            this.proveedorEditado = null;

            Swal.fire({
              icon: 'success',
              title: 'Proveedor actualizado',
              text: 'Los cambios se guardaron correctamente.',
              confirmButtonColor: '#3085d6',
            });
          }
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Por favor completa correctamente todos los campos.',
        confirmButtonColor: '#d33',
      });
    }
  }

  cancelarEdicion() {
    Swal.fire({
      title: '¿Cancelar edición?',
      text: 'Se perderán los cambios no guardados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.proveedorEditado = null;
      }
    });
  }

  eliminarProveedor(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el proveedor permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        const index = this.proveedores.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.proveedores.splice(index, 1);

          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El proveedor ha sido eliminado correctamente.',
            confirmButtonColor: '#3085d6',
          });
        }
      }
    });
  }

  abrirFormularioNuevoProveedor() {
    this.nuevoProveedor = {
      id: null,
      empresa: '',
      ruc: '',
      correo: '',
      telefono: '',
      estado: 'Activo',
    };
  }

  agregarProveedor(formulario: any) {
    if (formulario.valid) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas agregar este proveedor?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, agregar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          const nuevoId = this.proveedores.length + 1;
          this.proveedores.push({ ...this.nuevoProveedor, id: nuevoId });
          this.nuevoProveedor = null;

          Swal.fire({
            icon: 'success',
            title: 'Proveedor añadido',
            text: 'El proveedor se ha agregado correctamente.',
            confirmButtonColor: '#3085d6',
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Por favor completa correctamente todos los campos.',
        confirmButtonColor: '#d33',
      });
    }
  }

  cancelarFormularioNuevoProveedor() {
    Swal.fire({
      title: '¿Cancelar registro?',
      text: 'Se perderán los datos ingresados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.nuevoProveedor = null;
      }
    });
  }
}
