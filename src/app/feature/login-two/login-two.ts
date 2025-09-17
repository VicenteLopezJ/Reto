import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
@Component({
  selector: 'app-login-two',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-two.html',
  styleUrl: './login-two.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class LoginTwo {
selectedRole: 'cliente' | 'admin' = 'cliente'; // valor por defecto

  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  selectRole(role: 'cliente' | 'admin') {
    this.selectedRole = role;
  }

  onSubmit() {
    if (this.selectedRole === 'cliente') {
      this.router.navigate(['cliente', 'client-product']); // reemplaza con tu ruta real
    } else if (this.selectedRole === 'admin') {
      this.router.navigate(['dashboard']); // reemplaza con tu ruta real
    }
  }
}
