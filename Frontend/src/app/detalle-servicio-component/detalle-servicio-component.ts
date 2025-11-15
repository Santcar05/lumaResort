import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { Servicio } from '../Models/Servicio';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../generales-components/header-component/header-component';
import { FooterComponent } from '../generales-components/footer-component/footer-component';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-detalle-servicio-component',
  templateUrl: './detalle-servicio-component.html',
  styleUrls: ['./detalle-servicio-component.css'],
  imports: [CommonModule, HeaderComponent, FooterComponent, TranslateModule],
  standalone: true,
})
export class DetalleServicioComponent implements OnInit {
  servicio?: Servicio;
  loading = true;
  errorMsg = '';
  selectedImage = '';
  private baseUrl = 'http://localhost:8080/servicios';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMsg = 'ID de servicio no proporcionado.';
      this.loading = false;
      return;
    }

    this.fetchServicio(id);
  }

  private fetchServicio(id: string) {
    this.loading = true;
    this.errorMsg = '';
    this.http
      .get<Servicio>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError((err) => {
          console.error('Error al cargar servicio:', err);
          this.errorMsg =
            'No se pudo cargar el servicio. Verifica que el backend esté corriendo y la ruta sea correcta.';
          this.loading = false;
          return of(null);
        })
      )
      .subscribe((res) => {
        if (!res) return;
        this.servicio = res;
        this.selectedImage = res.imagenURL ?? '';
        this.loading = false;
      });
  }

  volverListado() {
    this.router.navigate(['/servicios']);
  }

  reservar() {
    // Acción de ejemplo: ir a formulario de reserva (ajusta la ruta según tu app)
    this.router.navigate(['/reservar', this.servicio?.idServicio]);
  }

  promedioCalificacion(): number {
    if (!this.servicio?.comentarios || this.servicio.comentarios.length === 0) return 0;
    const sum = this.servicio.comentarios.reduce((acc, c) => acc + (c.calificacion ?? 0), 0);
    return Math.round((sum / this.servicio.comentarios.length) * 10) / 10;
  }

  estrellas(n: number) {
    // devuelve array para ngFor
    return Array(Math.round(n));
  }

  fechaFormateada(fecha?: string | Date) {
    if (!fecha) return '';
    const d = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return d.toLocaleDateString();
  }

  onImageError(event: Event) {
    const el = event.target as HTMLImageElement;
    el.src =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="100%" height="100%" fill="%230a1524"/><text x="50%" y="50%" fill="%23c7b37a" font-size="24" font-family="Arial" text-anchor="middle">Imagen no disponible</text></svg>';
  }
}
