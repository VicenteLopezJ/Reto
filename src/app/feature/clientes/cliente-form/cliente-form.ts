import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import Swal from 'sweetalert2';
import { ClienteService } from '../../../core/services/cliente.service';
import { MatIconModule } from '@angular/material/icon'; 


@Component({
  selector: 'app-cliente-form',

  imports: [FormsModule,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.scss'
})
export class ClienteForm implements OnChanges, OnInit {
@Input() mostrarFormulario: boolean = false;
  @Input() clienteParaEditar: any = null;
  @Output() clienteGuardado = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<void>();

  editando: boolean = false;
  today: string = new Date().toISOString().split('T')[0];
  maxBirthdayDate: Date;

  nuevoCliente = {
    id: 0,
    firstName: '',
    lastName: '',
    birthdayDate: null as Date | null,
    documentType: 'DNI',
    documentNumber: '',
    email: '',
    phoneNumber: '',
    client_type: 'Minorista',
    address: '',
    registrationDate: new Date(),
    vip: false,
    estado: 'Activo',
  };

  constructor(private clienteService: ClienteService) {
    this.maxBirthdayDate = this.calculateMaxBirthdayDate();
  }

  ngOnInit() {}

  

  ngOnChanges() {
    if (this.clienteParaEditar) {
      this.editando = true;
      this.nuevoCliente = { ...this.clienteParaEditar };

      if (
        typeof this.nuevoCliente.birthdayDate === 'string' &&
        this.nuevoCliente.birthdayDate
      ) {
        this.nuevoCliente.birthdayDate = new Date(
          this.nuevoCliente.birthdayDate
        );
      }

      if (
        typeof this.nuevoCliente.registrationDate === 'string' &&
        this.nuevoCliente.registrationDate
      ) {
        this.nuevoCliente.registrationDate = new Date(
          this.nuevoCliente.registrationDate
        );
      }
    } else {
      this.editando = false;
      this.nuevoCliente = {
        id: 0,
        firstName: '',
        lastName: '',
        birthdayDate: null,
        documentType: 'DNI',
        documentNumber: '',
        email: '',
        phoneNumber: '',
        client_type: 'Minorista',
        address: '',
        registrationDate: new Date(),
        vip: false,
        estado: 'Activo',
      };
    }
  }

  private calculateMaxBirthdayDate(): Date {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today;
  }

  confirmarGuardar() {
    this.guardarCliente();
  }

  guardarCliente() {
    const clienteParaEmitir: any = {
      id: this.nuevoCliente.id === 0 ? null : this.nuevoCliente.id,
      firstName: this.nuevoCliente.firstName,
      lastName: this.nuevoCliente.lastName,
      birthdayDate: this.nuevoCliente.birthdayDate
        ? this.nuevoCliente.birthdayDate.toISOString().split('T')[0]
        : null,
      registrationDate: this.nuevoCliente.registrationDate
        ? this.nuevoCliente.registrationDate.toISOString().split('T')[0]
        : null,
      documentType: this.nuevoCliente.documentType,
      documentNumber: this.nuevoCliente.documentNumber,
      email: this.nuevoCliente.email,
      phoneNumber: this.nuevoCliente.phoneNumber
        ? String(this.nuevoCliente.phoneNumber)
        : null,
      client_type:
        this.nuevoCliente.client_type === 'Minorista'
          ? 'MI'
          : this.nuevoCliente.client_type === 'Mayorista'
          ? 'MA'
          : this.nuevoCliente.client_type,
      address: this.nuevoCliente.address,
      vip: this.nuevoCliente.vip,
      estado:
        this.nuevoCliente.estado === 'Activo'
          ? 'A'
          : this.nuevoCliente.estado === 'Inactivo'
          ? 'I'
          : this.nuevoCliente.estado,
    };

    this.clienteService.save(clienteParaEmitir).subscribe({
      next: (resp: any) => {
        Swal.fire({
          title: 'Guardado',
          text: 'Cambios guardados',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        this.clienteGuardado.emit(resp);
        this.cancelarFormulario();
      },
      error: (err: any) => {
        let errorMessage =
          'Error al guardar el cliente. Por favor, inténtalo de nuevo.';
        const backendErrorDetail = err.error?.message || err.message || '';
        const lowerCaseError = String(backendErrorDetail).toLowerCase();

        if (lowerCaseError.includes('unique key constraint')) {
          if (
            lowerCaseError.includes('uq_cell_number_client') ||
            lowerCaseError.includes('phonenumber')
          ) {
            errorMessage =
              'El número de celular que intentas registrar ya existe.';
          } else if (
            lowerCaseError.includes('uq_document_number_client') ||
            lowerCaseError.includes('documentnumber')
          ) {
            errorMessage = `El ${this.nuevoCliente.documentType} que intentas registrar ya existe.`;
          } else if (
            lowerCaseError.includes('uq_email_client') ||
            lowerCaseError.includes('email')
          ) {
            errorMessage =
              'El correo electrónico que intentas registrar ya existe.';
          } else {
            errorMessage =
              'Ya existe un cliente con información duplicada (por ejemplo, DNI/CNE, celular o correo).';
          }
        }

        Swal.fire({
          title: 'Error al Guardar',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      },
    });
  }

  confirmarCancelar() {
    this.cancelarFormulario();
  }

  cancelarFormulario() {
    this.cancelar.emit();
  }
}
