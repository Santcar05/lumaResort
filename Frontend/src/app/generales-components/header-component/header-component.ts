import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-component',
  imports: [RouterModule],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent {
  menuVisible = false;
  private hideTimer: any;

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
    if (this.menuVisible) {
      clearTimeout(this.hideTimer);
    }
  }

  onMouseEnter() {
    clearTimeout(this.hideTimer);
  }

  onMouseLeave() {
    this.hideTimer = setTimeout(() => {
      this.menuVisible = false;
    }, 2000); // 2 segundos
  }
}
