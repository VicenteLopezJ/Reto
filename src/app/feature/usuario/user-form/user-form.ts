import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { format, parseISO, isValid, parse, startOfDay } from 'date-fns';

import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Usuario } from '../../../core/interfaces/usuario';
import { UsuarioService } from '../../../core/services/usuario.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule ,
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm implements OnInit {
  userForm!: FormGroup;
  isEditMode: boolean;
  dialogTitle: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserForm>,
    @Inject(MAT_DIALOG_DATA)
    public data: { isEdit: boolean; usuario?: Usuario },
    private usuarioService: UsuarioService
  ) {
    this.isEditMode = data.isEdit;
    this.dialogTitle = this.isEditMode ? 'Editar Vendedor' : 'Añadir Vendedor';
  }

  ngOnInit(): void {
    console.log(
      '[UserForm] ngOnInit called. Is Edit Mode:',
      this.isEditMode,
      'Data:',
      this.data.usuario
    );

    this.userForm = this.fb.group({
      id: [null],
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      documentType: ['DNI', Validators.required],
      numberDocument: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      registrationDate: [{ value: null as Date | null, disabled: true }, Validators.required],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      gender: ['Masculino', Validators.required], // Default to 'Masculino'
      totalSales: [0],
      totalSaleAmount: [0],
      lastSaleDate: [null],
      estado: ['A', Validators.required], // Default to 'Activo'
    });

    if (this.isEditMode && this.data.usuario) {
      const usuario = this.data.usuario;

      let parsedRegistrationDate: Date | null = null;
      if (usuario.registrationDate) {
        if (usuario.registrationDate instanceof Date) {
          parsedRegistrationDate = usuario.registrationDate;
        } else if (typeof usuario.registrationDate === 'string') {
          const parsed = parse(usuario.registrationDate, 'yyyy-MM-dd', new Date());
          if (isValid(parsed)) {
            parsedRegistrationDate = parsed;
          } else {
            const dateAttempt = new Date(usuario.registrationDate);
            if (isValid(dateAttempt)) {
              parsedRegistrationDate = dateAttempt;
            } else {
              console.warn(
                'Could not parse registrationDate after multiple attempts:',
                usuario.registrationDate
              );
            }
          }
        }
      }

      let parsedLastSaleDate: Date | null = null;
      if (usuario.lastSaleDate) {
        if (usuario.lastSaleDate instanceof Date) {
          parsedLastSaleDate = usuario.lastSaleDate;
        } else if (typeof usuario.lastSaleDate === 'string') {
          const parsed = parse(usuario.lastSaleDate, 'yyyy-MM-dd', new Date());
          if (isValid(parsed)) {
            parsedLastSaleDate = parsed;
          } else {
            const dateAttempt = new Date(usuario.lastSaleDate);
            if (isValid(dateAttempt)) {
              parsedLastSaleDate = dateAttempt;
            } else {
              console.warn(
                'Could not parse lastSaleDate after multiple attempts:',
                usuario.lastSaleDate
              );
            }
          }
        }
      }

      this.userForm.patchValue({
        id: usuario.id,
        firstName: usuario.firstName,
        lastName: usuario.lastName,
        documentType: usuario.documentType,
        numberDocument: usuario.numberDocument,
        phoneNumber: usuario.phoneNumber,
        email: usuario.email,
        registrationDate: parsedRegistrationDate,
        address: usuario.address,
        gender: usuario.gender,
        totalSales: usuario.totalSales,
        totalSaleAmount: usuario.totalSaleAmount,
        lastSaleDate: parsedLastSaleDate,
        estado: usuario.estado ?? 'A',
      });
    } else {
      console.log('[UserForm] Creating new user. Setting default registration date.');
      this.userForm.get('registrationDate')?.setValue(startOfDay(new Date()));
      this.userForm.get('registrationDate')?.disable(); // Keep disabled for new entries
    }

    this.userForm.get('firstName')?.valueChanges.subscribe(() => this.updateAvatarPlaceholder());
    this.userForm.get('lastName')?.valueChanges.subscribe(() => this.updateAvatarPlaceholder());
  }

  getAvatarPlaceholder(): string {
    const firstName = this.userForm.get('firstName')?.value || '';
    const lastName = this.userForm.get('lastName')?.value || '';
    const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    console.log('[UserForm] Getting avatar placeholder. Initials:', initials);
    return initials || '?';
  }

  updateAvatarPlaceholder(): void {
    // No direct logic needed here to update a variable, as getAvatarPlaceholder() is called from HTML.
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Error de validación',
        text: 'Por favor, complete todos los campos obligatorios y válidos antes de guardar.',
        confirmButtonColor: '#fc5c7d',
      });
      console.warn('[UserForm] Form is invalid. Not submitting.');
      return;
    }

    console.log('[UserForm] Form is valid. Preparing to submit.');

    const registrationDateControl = this.userForm.get('registrationDate');
    const wasDisabled = registrationDateControl?.disabled;
    if (wasDisabled) {
      registrationDateControl?.enable(); // Temporarily enable to get value
    }

    let userData: Usuario = { ...this.userForm.value };

    if (wasDisabled) {
      registrationDateControl?.disable(); // Disable again if it was originally disabled
    }

    // Format dates before sending to backend to 'yyyy-MM-dd'
    if (userData.registrationDate instanceof Date && isValid(userData.registrationDate)) {
      userData.registrationDate = format(userData.registrationDate, 'yyyy-MM-dd') as any;
    } else {
      userData.registrationDate = null as any;
    }

    if (userData.lastSaleDate instanceof Date && isValid(userData.lastSaleDate)) {
      userData.lastSaleDate = format(userData.lastSaleDate, "yyyy-MM-dd'T'HH:mm:ss") as any;
    } else {
      userData.lastSaleDate = null as any;
    }

    const saveOrUpdateObservable =
      this.isEditMode && userData.id
        ? this.usuarioService.update(userData)
        : this.usuarioService.save(userData);

    console.log('[UserForm] Sending user data:', userData);

    saveOrUpdateObservable.subscribe({
      next: (savedOrUpdatedUser: Usuario) => {
        console.log('[UserForm] User saved/updated:', savedOrUpdatedUser);
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: `Vendedor ${this.isEditMode ? 'actualizado' : 'añadido'} exitosamente.`,
          confirmButtonColor: '#6a82fb',
        });
        this.dialogRef.close(true);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error FATAL al guardar/actualizar usuario:', err);
        let fatalErrorMessage = 'Error crítico al guardar/actualizar la información del vendedor.';

        if (err.status === 0) {
          fatalErrorMessage =
            'Error de conexión con el servidor al guardar los datos del vendedor. Verifique que el backend esté funcionando.';
        } else if (typeof err.error === 'string') {
          fatalErrorMessage = `Error del servidor (${err.status}): ${err.error}`;
        } else if (err.error && err.error.message) {
          fatalErrorMessage = `Error del servidor (${err.status}): ${err.error.message}`;
        } else if (err.status) {
          fatalErrorMessage = `Error del servidor (${err.status}): ${err.statusText}`;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Ha ocurrido un error: ${fatalErrorMessage}`,
          confirmButtonColor: '#fc5c7d',
        });
        this.dialogRef.close(false);
      },
    });
  }

  onCancel(): void {
    console.log('[UserForm] Dialog cancelled.');

    // Dynamic text based on isEditMode
    const confirmationText = this.isEditMode
      ? '¿Estás seguro de cancelar? Los cambios no guardados en el vendedor se perderán.'
      : '¿Estás seguro de cancelar? Se descartará la creación del nuevo vendedor.';

    Swal.fire({
      title: 'Confirmar Cancelación', // More specific title
      text: confirmationText, // Dynamic text
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#fc5c7d', // Use the "warn" color for discard/cancel
      cancelButtonColor: '#6a82fb', // Use the "primary" color for keeping editing
      confirmButtonText: 'Sí, cancelar y salir', // More explicit action
      cancelButtonText: 'No, seguir editando',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dialogRef.close(false); // Close dialog without saving
      }
      // If not confirmed, dialog remains open and user can continue editing
    });
  }
}
