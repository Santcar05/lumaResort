import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { OfertaFlash } from '../Models/OfertaFlash';

@Injectable({
  providedIn: 'root',
})
export class OfertaFlashService {
  private apiUrl = 'http://localhost:8080/ofertas-flash';
  private pollingEnabled = false;

  // compartir ofertas activas entre componentes
  private ofertasActivasSubject = new BehaviorSubject<OfertaFlash[]>([]);
  public ofertasActivas$ = this.ofertasActivasSubject.asObservable();

  constructor(private http: HttpClient) {}

  iniciarPolling(): void {
    if (this.pollingEnabled) return;

    this.pollingEnabled = true;

    // Cargar ofertas inmediatamente
    this.cargarOfertasActivas();

    // verificar nuevas ofertas
    interval(300000)
      .pipe(
        switchMap(() =>
          this.getOfertasActivas().pipe(
            catchError((error) => {
              console.error('Error en polling de ofertas:', error);
              return of([]);
            })
          )
        )
      )
      .subscribe((ofertas) => {
        this.ofertasActivasSubject.next(ofertas);
      });
  }

  // Obtener todas las ofertas
  getAllOfertas(): Observable<OfertaFlash[]> {
    return this.http.get<OfertaFlash[]>(this.apiUrl);
  }

  // Obtener ofertas activas
  getOfertasActivas(): Observable<OfertaFlash[]> {
    return this.http.get<OfertaFlash[]>(`${this.apiUrl}/activas`);
  }

  // Obtener oferta por ID
  getOfertaById(id: number): Observable<OfertaFlash> {
    return this.http.get<OfertaFlash>(`${this.apiUrl}/${id}`);
  }

  // Obtener ofertas por tipo
  getOfertasByTipo(tipo: string): Observable<OfertaFlash[]> {
    return this.http.get<OfertaFlash[]>(`${this.apiUrl}/tipo/${tipo}`);
  }

  // Crear nueva oferta
  createOferta(oferta: OfertaFlash): Observable<OfertaFlash> {
    return this.http.post<OfertaFlash>(this.apiUrl, oferta);
  }

  // Actualizar oferta
  updateOferta(id: number, oferta: OfertaFlash): Observable<OfertaFlash> {
    return this.http.put<OfertaFlash>(`${this.apiUrl}/${id}`, oferta);
  }

  // Eliminar oferta
  deleteOferta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Cargar ofertas activas y actualizar
  cargarOfertasActivas(): void {
    this.getOfertasActivas()
      .pipe(
        catchError((error) => {
          console.error('Error al cargar ofertas flash:', error);
          console.warn('El backend no está disponible. El banner de ofertas no se mostrará.');
          return of([]);
        })
      )
      .subscribe((ofertas) => {
        // Filtrar ofertas válidas en el cliente
        const ofertasValidas = this.filtrarOfertasValidas(ofertas);

        if (ofertasValidas && ofertasValidas.length > 0) {
          console.log('✅ Ofertas flash válidas cargadas:', ofertasValidas);
        } else {
          console.log('ℹ️ No hay ofertas válidas disponibles');
        }
        this.ofertasActivasSubject.next(ofertasValidas);
      });
  }

  // Forzar recarga de ofertas
  recargarOfertas(): void {
    this.cargarOfertasActivas();
  }

  // Validar que las ofertas no estén expiradas en el cliente
  private filtrarOfertasValidas(ofertas: OfertaFlash[]): OfertaFlash[] {
    const ahora = new Date();
    return ofertas.filter((oferta) => {
      const fechaFin = new Date(oferta.fechaFin);
      return fechaFin > ahora;
    });
  }
}
