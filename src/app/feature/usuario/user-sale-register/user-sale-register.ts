import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-sale-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './user-sale-register.html',
  styleUrl: './user-sale-register.scss',
})
export class UserSaleRegister implements OnInit {
  saleForm!: FormGroup;
  userName: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserSaleRegister>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number; userName: string }
  ) {
    this.userName = data.userName;
  }

  ngOnInit(): void {
    this.saleForm = this.fb.group({
      saleAmount: [
        '',
        [Validators.required, Validators.min(0.01), Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
      quantity: ['', [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]], // Requires at least 1, only whole numbers
    });
  }

  onRegister(): void {
    if (this.saleForm.invalid) {
      this.saleForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulario Inválido',
        text: 'Por favor, complete todos los campos requeridos con valores válidos.',
        confirmButtonColor: '#fc5c7d',
      });
      return;
    }

    const { saleAmount, quantity } = this.saleForm.value;

    Swal.fire({
      title: '¿Estás seguro?',
      html: `¿Deseas registrar una venta de <strong>S/ ${saleAmount}</strong> (Cantidad: <strong>${quantity}</strong>) para <strong>${this.userName}</strong>?`, // Updated message
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'No, cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dialogRef.close({ saleAmount: saleAmount, quantity: quantity });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Registro Cancelado',
          text: 'La operación de registro de venta ha sido cancelada.',
          icon: 'info',
          confirmButtonColor: '#fc5c7d',
        });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
