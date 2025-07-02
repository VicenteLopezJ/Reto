import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClienteFormComponent } from '../cliente-form/cliente-form.component';
import { Cliente } from '../../../core/interfaces/cliente';
import { ClienteService } from '../../../core/services/cliente.service';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ClienteFormComponent],
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.scss'],
})
export class ClienteListComponent implements OnInit {
  clientes: Cliente[] = [];
  filtroEstado: string = 'A';
  mensajeFeedback: string = '';
  mensajeTipo: 'success' | 'error' | 'info' | '' = '';

  isFormModalOpen: boolean = false;
  clienteToEdit: Cliente | null = null;
  formModalTitle: string = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    const estado = this.filtroEstado === '' ? '' : this.filtroEstado;
    this.clienteService.getClientesByEstado(estado).subscribe(
      (data) => {
        this.clientes = data;
        this.clearFeedback();
      },
      (error) => {
        console.error('Error al cargar clientes:', error);
        this.showFeedback('Error al cargar clientes.', 'error');
      }
    );
  }

  onEstadoChange(): void {
    this.loadClientes();
  }

  openFormModal(cliente?: Cliente): void {
    this.clienteToEdit = cliente || null;
    this.formModalTitle = cliente ? 'Editar Cliente' : 'Nuevo Cliente';
    this.isFormModalOpen = true;
    console.log('Modal opened. isFormModalOpen:', this.isFormModalOpen); 
  }

  closeFormModal(): void {
    this.isFormModalOpen = false;
    this.clienteToEdit = null;
    this.formModalTitle = '';
    console.log('Modal closed. isFormModalOpen:', this.isFormModalOpen); 
  }

  handleFormSubmitted(success: boolean): void {
    console.log(
      'handleFormSubmitted called in ClienteListComponent. Success:',
      success
    ); 
    if (success) {
      this.showFeedback(
        this.clienteToEdit
          ? 'Cliente actualizado con éxito!'
          : 'Cliente guardado con éxito!',
        'success'
      );
      this.loadClientes(); 
    } else {
      this.showFeedback('Hubo un error al procesar el cliente.', 'error');
    }

    this.closeFormModal();
  }

  handleFormCancelled(): void {
    console.log('handleFormCancelled called in ClienteListComponent.'); 
    this.showFeedback('Operación de formulario cancelada.', 'info'); 
    this.closeFormModal();
  }

  addCliente(): void {
    this.openFormModal();
  }

  editCliente(cliente: Cliente): void {
    this.openFormModal(cliente);
  }

  deleteClienteLogico(id: number | undefined): void {
    if (
      id !== undefined &&
      confirm('¿Estás seguro de desactivar este cliente?')
    ) {
      this.clienteService.deleteClienteLogico(id).subscribe(
        () => {
          this.showFeedback(`Cliente ${id} desactivado.`, 'success');
          this.loadClientes();
        },
        (error) => {
          console.error('Error al desactivar el cliente:', error);
          this.showFeedback('Error al desactivar cliente.', 'error');
        }
      );
    }
  }

  deleteClienteFisico(id: number | undefined): void {
    if (
      id !== undefined &&
      confirm(
        '¡ADVERTENCIA! ¿Estás seguro de eliminar PERMANENTEMENTE este cliente? Esta acción es irreversible.'
      )
    ) {
      this.clienteService.deleteClienteFisico(id).subscribe(
        () => {
          this.showFeedback(
            `Cliente ${id} eliminado permanentemente.`,
            'success'
          );
          this.loadClientes();
        },
        (error) => {
          console.error('Error al eliminar físicamente el cliente:', error);
          this.showFeedback(
            'Error al eliminar permanentemente el cliente.',
            'error'
          );
        }
      );
    }
  }

  restoreCliente(id: number | undefined): void {
    if (
      id !== undefined &&
      confirm('¿Estás seguro de restaurar este cliente?')
    ) {
      this.clienteService.restoreCliente(id).subscribe(
        () => {
          this.showFeedback(`Cliente ${id} restaurado.`, 'success');
          this.loadClientes();
        },
        (error) => {
          console.error('Error al restaurar el cliente:', error);
          this.showFeedback('Error al restaurar cliente.', 'error');
        }
      );
    }
  }

  showFeedback(message: string, type: 'success' | 'error' | 'info'): void {
    this.mensajeFeedback = message;
    this.mensajeTipo = type;
    setTimeout(() => {
      this.clearFeedback();
    }, 4000);
  }

  clearFeedback(): void {
    this.mensajeFeedback = '';
    this.mensajeTipo = '';
  }
}
