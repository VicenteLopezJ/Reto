import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cliente-interfas',
  imports: [RouterModule],
  templateUrl: './cliente-interfas.html',
  styleUrl: './cliente-interfas.scss',
})
export class ClienteInterfas {
  constructor(private router: Router) {}

  logout() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Estás a punto de salir de tu cuenta.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/login-two']);
      }
    });
  }
}
