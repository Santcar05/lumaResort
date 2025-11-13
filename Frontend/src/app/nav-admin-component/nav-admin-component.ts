import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';

@Component({
  selector: 'app-nav-admin-component',
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-admin-component.html',
  styleUrl: './nav-admin-component.css',
})
export class NavAdminComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
