import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-header-component',
  standalone: true, 
  imports: [CommonModule, RouterModule], 
  templateUrl: './header-component.html',
  styleUrls: ['./header-component.css']
})
export class HeaderComponent implements OnInit {
  menuVisible = false;
  isLoggedIn = false;
  usuarioId: number | null = null; 

 constructor(private router: Router) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const usuario = JSON.parse(userData);
      if (usuario && usuario.idUsuario) {
        this.isLoggedIn = true;
        this.usuarioId = usuario.idUsuario; 
      }
    } else {
      this.isLoggedIn = false;
    }
  }


  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  onMouseEnter() {
    this.menuVisible = true;
  }

  onMouseLeave() {
    this.menuVisible = false;
  }

  logout(): void {
    localStorage.removeItem('userData');
    this.isLoggedIn = false;
    this.usuarioId = null;
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}
