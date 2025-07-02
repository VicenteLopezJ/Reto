import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Cliente } from '../../../core/interfaces/cliente';
import { ClienteService } from '../../../core/services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss'],
})
export class ClienteFormComponent implements OnInit, OnChanges {
  @Input() clienteDataFromParent: Cliente | null = null;
  @Input() isModalMode: boolean = false;
  @Output() formSubmitted = new EventEmitter<boolean>();
  @Output() formCancelled = new EventEmitter<void>();

  clienteForm!: FormGroup;
  isEditMode: boolean = false;
  clienteId: number | null = null;
  mensajeFeedback: string = '';
  mensajeTipo: 'success' | 'error' | 'info' | '' = '';

  componentMode: 'route' | 'modal' = 'route';

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clienteForm = this.fb.group({
      id: [null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      documentType: ['', Validators.required],
      documentNumber: ['', Validators.required],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{9}$')],
      ],
      email: ['', [Validators.required, Validators.email]],
      // Removed: registrationDate: [null], // This form control is no longer desired
      estado: ['A'],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['isModalMode'] &&
      changes['isModalMode'].currentValue === true
    ) {
      this.componentMode = 'modal';
      console.log('ClienteFormComponent Mode set to: Modal via ngOnChanges');
    }

    if (
      changes['clienteDataFromParent'] &&
      changes['clienteDataFromParent'].currentValue !== undefined &&
      this.componentMode === 'modal'
    ) {
      if (this.clienteDataFromParent) {
        if (this.clienteDataFromParent.id) {
          this.isEditMode = true;
          this.clienteId = this.clienteDataFromParent.id;
        } else {
          this.isEditMode = false;
          this.clienteId = null;
        }
        this.clienteForm.patchValue(this.clienteDataFromParent);
        console.log(
          'ClienteForm patched with clienteDataFromParent in modal mode.'
        );
      }
    }
  }

  ngOnInit(): void {
    if (!this.isModalMode) {
      this.componentMode = 'route';
      console.log('ClienteFormComponent Mode: Route (via ngOnInit default)');
      this.route.paramMap.subscribe((params) => {
        const idParam = params.get('id');
        if (idParam) {
          this.clienteId = +idParam;
          this.isEditMode = true;
          this.loadCliente(this.clienteId);
        } else {
          this.isEditMode = false;
          this.clienteId = null;
        }
      });
    }
  }

  loadCliente(id: number): void {
    this.clienteService.getClienteById(id).subscribe({
      next: (cliente: Cliente) => {
        this.clienteForm.patchValue(cliente);
        this.clearFeedback();
      },
      error: (error) => {
        console.error('Error al cargar cliente para edición:', error);
        this.showFeedback('Error al cargar cliente para edición.', 'error');
        if (this.componentMode === 'route') {
          this.router.navigate(['/clientes']);
        }
      },
    });
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      const cliente: Cliente = this.clienteForm.value;
      if (this.isEditMode) {
        this.clienteService.updateCliente(cliente).subscribe({
          next: () => {
            this.showFeedback('Cliente actualizado con éxito!', 'success');
            if (this.componentMode === 'route') {
              this.router.navigate(['/clientes']);
            } else {
              this.formSubmitted.emit(true);
              console.log(
                'formSubmitted event emitted (update success) from ClienteFormComponent.'
              );
            }
          },
          error: (error) => {
            console.error('Error al actualizar cliente:', error);
            this.showFeedback('Error al actualizar cliente.', 'error');
            if (this.componentMode === 'modal') {
              this.formSubmitted.emit(false);
              console.log(
                'formSubmitted event emitted (update error) from ClienteFormComponent.'
              );
            }
          },
        });
      } else {
        this.clienteService.saveCliente(cliente).subscribe({
          next: () => {
            this.showFeedback('Cliente guardado con éxito!', 'success');
            if (this.componentMode === 'route') {
              this.router.navigate(['/clientes']);
            } else {
              this.formSubmitted.emit(true);
              console.log(
                'formSubmitted event emitted (save success) from ClienteFormComponent.'
              );
            }
          },
          error: (error) => {
            console.error('Error al guardar cliente:', error);
            this.showFeedback('Error al guardar cliente.', 'error');
            if (this.componentMode === 'modal') {
              this.formSubmitted.emit(false);
              console.log(
                'formSubmitted event emitted (save error) from ClienteFormComponent.'
              );
            }
          },
        });
      }
    } else {
      this.showFeedback('Formulario inválido. Revise los campos.', 'error');
      this.clienteForm.markAllAsTouched();
    }
  }

  cancel(): void {
    console.log('Cancel button clicked. Component Mode:', this.componentMode);
    if (this.componentMode === 'route') {
      this.router.navigate(['/clientes']);
    } else {
      this.formCancelled.emit();
      console.log('formCancelled event emitted from ClienteFormComponent.');
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