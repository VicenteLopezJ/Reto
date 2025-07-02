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
  AbstractControl, // Import AbstractControl for easier type checking
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
      firstName: ['', [Validators.required, Validators.maxLength(100)]], // Added max length
      lastName: ['', [Validators.required, Validators.maxLength(100)]], // Added max length
      documentType: ['', Validators.required],
      documentNumber: ['', Validators.required], // Validators will be set dynamically
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^9[0-9]{8}$')], // Changed pattern to start with 9 and be 9 digits
      ],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]], // Added max length
      registrationDate: [{ value: '', disabled: true }], // Added, disabled as it's set by backend
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
        // If patching in modal mode, ensure validators are set correctly after patch
        this.setDocumentNumberValidators(this.clienteDataFromParent.documentType);
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

    // Set up subscription for documentType changes
    this.clienteForm.get('documentType')?.valueChanges.subscribe((docType) => {
      this.setDocumentNumberValidators(docType);
    });

    // Initialize validators for documentNumber based on initial/loaded value
    // This is important if an existing client is loaded and documentType already has a value
    this.setDocumentNumberValidators(this.clienteForm.get('documentType')?.value);
  }

  loadCliente(id: number): void {
    this.clienteService.getClienteById(id).subscribe({
      next: (cliente: Cliente) => {
        this.clienteForm.patchValue(cliente);
        this.setDocumentNumberValidators(cliente.documentType); // Apply validators after loading data
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

  /**
   * Dynamically sets validators for the documentNumber field based on documentType.
   * @param documentType The selected document type (e.g., 'DNI', 'CNE').
   */
  setDocumentNumberValidators(documentType: string): void {
    const documentNumberControl = this.clienteForm.get('documentNumber');
    if (!documentNumberControl) {
      return; // Should not happen
    }

    const validators: any[] = [Validators.required];

    if (documentType === 'DNI') {
      validators.push(
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.pattern('^[0-9]+$') // Only digits for DNI
      );
    } else if (documentType === 'CNE') { // Changed 'CE' to 'CNE'
      validators.push(
        Validators.minLength(20),
        Validators.maxLength(20)
        // No specific pattern for CNE other than length based on SQL,
        // but you could add one if needed (e.g., alphanumeric, specific format)
      );
    }

    documentNumberControl.setValidators(validators);
    documentNumberControl.updateValueAndValidity(); // Recalculate validation status
  }

  onSubmit(): void {
    // Mark all controls as touched to trigger validation messages before submission
    this.clienteForm.markAllAsTouched();

    if (this.clienteForm.valid) {
      const cliente: Cliente = { ...this.clienteForm.value };
      // Remove registrationDate if it's disabled and not part of the backend submission
      // Or, if backend expects it but generates it, you might remove it here
      // For now, let's assume backend handles it. If not, consider `cliente.registrationDate = undefined;`
      // For editing, ensure the 'id' is included in the payload from the form.
      // If you disabled 'id' in the form, you'd need to re-add it if editing.
      // Current setup for `id: [null]` implies it's included for update.


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
        // When saving a new client, registrationDate is not sent from the form,
        // as the backend automatically assigns it with GETDATE().
        // Ensure you're not sending a null/empty registrationDate to backend if it causes issues.
        // The `registrationDate: [{ value: '', disabled: true }],` above helps prevent sending it.
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
      // Already handled by markAllAsTouched()
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