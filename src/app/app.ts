import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  title = 'Agro-Inversiones';

  constructor(public router: Router) {}

  get showSidebar(): boolean {
    return this.router.url !== '/login-two';
  }
}
