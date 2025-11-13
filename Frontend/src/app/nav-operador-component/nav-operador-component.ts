import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';

@Component({
  selector: 'app-nav-operador-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-operador-component.html',
  styleUrls: ['./nav-operador-component.css'],
})
export class NavOperadorComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
