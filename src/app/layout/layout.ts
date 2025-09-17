import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterModule, MatSidenavModule, MatIconModule, MatButtonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout implements OnInit {
sidebarOpen = false;
  isScreenSmall = false;
  isBrowser = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router  
  ) {}

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.checkScreen();
    }
  }

  @HostListener('window:resize', [])
  onResize() {
    if (this.isBrowser) {
      this.checkScreen();
    }
  }

  checkScreen() {
    if (this.isBrowser && typeof window !== 'undefined') {
      this.isScreenSmall = window.innerWidth < 768;
      if (!this.isScreenSmall) {
        this.sidebarOpen = false;
      }
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
  
    localStorage.removeItem('token');  
    this.router.navigate(['/login']);  
  }
}
