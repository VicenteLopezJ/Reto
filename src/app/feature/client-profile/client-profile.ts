import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-client-profile',
  imports: [CommonModule,
    FormsModule, 
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './client-profile.html',
  styleUrl: './client-profile.scss'
})
export class ClientProfile {
 nombre: string = 'Jeampier';
  apellido: string = 'lopez';
  correoElectronico: string = 'asdf@gmail.com';
  telefono: string = '987654';
  direccion: string = 'San Vicente De';
  tipoCliente: string = 'Minorista';

  guardarCambios() {
    console.log('Datos guardados:', {
      nombre: this.nombre,
      apellido: this.apellido,
      correoElectronico: this.correoElectronico,
      telefono: this.telefono,
      direccion: this.direccion,
      tipoCliente: this.tipoCliente
    });

  }

  cerrarSesion() {
    console.log('Cerrar Sesión clicked');
  
  }
}
