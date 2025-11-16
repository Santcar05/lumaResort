import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from '../generales-components/header-component/header-component';
import { Subscription } from 'rxjs';

// Modelos
interface Mensaje {
  contenido: string;
  esUsuario: boolean;
  timestamp: Date;
}

interface Clima {
  temperatura: number;
  descripcion: string;
  humedad: number;
  icono: string;
}

@Component({
  selector: 'app-chatbot-component',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, TranslateModule],
  templateUrl: './chatbot-component.html',
  styleUrls: ['./chatbot-component.css'],
})
export class ChatbotComponent implements OnInit, AfterViewChecked, OnDestroy {
  /** ------------------ VARIABLES PRINCIPALES ------------------ **/

  // Estado del chat
  mensajes: Mensaje[] = [];
  mensajeActual: string = '';
  escribiendo: boolean = false;
  enviando: boolean = false;
  grabando: boolean = false;

  // Configuración
  temaOscuro: boolean = true;
  clima: Clima | null = null;

  // Textos traducidos para usar en (click)
  quickBookings: string = '';
  quickServices: string = '';
  quickTourism: string = '';
  quickRestaurants: string = '';
  actionBookRoom: string = '';
  actionHotelServices: string = '';
  actionSchedules: string = '';
  actionTransport: string = '';

  private langChangeSubscription?: Subscription;

  // Referencias del DOM
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;
  @ViewChild('mensajeInput') private mensajeInput!: ElementRef;

  /** ------------------ URLs DEL BACKEND ------------------ **/
  private baseUrlChatbot = 'http://localhost:8080/api/chatbot';
  private baseUrlClima = 'http://localhost:8080/api/clima';

  constructor(
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService
  ) {}

  /** ------------------ CICLO DE VIDA ------------------ **/
  ngOnInit(): void {
    this.cargarClima();
    this.inicializarReconocimientoVoz();
    this.loadTranslations();

    // Suscribirse a cambios de idioma
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.loadTranslations();
    });
  }

  ngOnDestroy(): void {
    this.langChangeSubscription?.unsubscribe();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  /** ------------------ CARGAR TRADUCCIONES ------------------ **/
  private loadTranslations(): void {
    this.translate
      .get([
        'CHATBOT.QUICK_BOOKINGS',
        'CHATBOT.QUICK_SERVICES',
        'CHATBOT.QUICK_TOURISM',
        'CHATBOT.QUICK_RESTAURANTS',
        'CHATBOT.ACTION_BOOK_ROOM',
        'CHATBOT.ACTION_HOTEL_SERVICES',
        'CHATBOT.ACTION_SCHEDULES',
        'CHATBOT.ACTION_TRANSPORT',
      ])
      .subscribe((translations) => {
        this.quickBookings = translations['CHATBOT.QUICK_BOOKINGS'];
        this.quickServices = translations['CHATBOT.QUICK_SERVICES'];
        this.quickTourism = translations['CHATBOT.QUICK_TOURISM'];
        this.quickRestaurants = translations['CHATBOT.QUICK_RESTAURANTS'];
        this.actionBookRoom = translations['CHATBOT.ACTION_BOOK_ROOM'];
        this.actionHotelServices = translations['CHATBOT.ACTION_HOTEL_SERVICES'];
        this.actionSchedules = translations['CHATBOT.ACTION_SCHEDULES'];
        this.actionTransport = translations['CHATBOT.ACTION_TRANSPORT'];
      });
  }

  /** ------------------ FUNCIONES DEL CHAT ------------------ **/

  enviarMensaje(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    const mensaje = this.mensajeActual.trim();
    if (!mensaje || this.enviando) return;

    // Agregar mensaje del usuario
    this.agregarMensaje(mensaje, true);
    this.mensajeActual = '';
    this.enviando = true;

    // Simular escritura del bot
    this.escribiendo = true;

    // Enviar al backend
    this.http.post<any>(this.baseUrlChatbot, { mensaje }).subscribe({
      next: (response) => {
        this.escribiendo = false;
        this.enviando = false;
        this.agregarMensaje(response.respuesta, false);
      },
      error: () => {
        this.escribiendo = false;
        this.enviando = false;
        this.translate.get('CHATBOT.ERROR_MESSAGE').subscribe((errorMsg: string) => {
          this.agregarMensaje(errorMsg, false);
        });
      },
    });
  }

  agregarMensaje(contenido: string, esUsuario: boolean): void {
    this.mensajes.push({
      contenido,
      esUsuario,
      timestamp: new Date(),
    });
  }

  sugerirConsulta(consulta: string): void {
    this.mensajeActual = consulta;
    this.enviarMensaje();
  }

  limpiarChat(): void {
    this.mensajes = [];
  }

  formatearMensaje(contenido: string): string {
    // Formatear URLs como enlaces
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return contenido.replace(urlRegex, '<a href="$1" target="_blank" class="message-link">$1</a>');
  }

  /** ------------------ FUNCIONES DE INTERFAZ ------------------ **/

  scrollToBottom(): void {
    try {
      this.chatMessagesContainer.nativeElement.scrollTop =
        this.chatMessagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  toggleTheme(): void {
    this.temaOscuro = !this.temaOscuro;
    const container = document.querySelector('.chatbot-container');
    if (container) {
      if (this.temaOscuro) {
        container.classList.remove('light-theme');
      } else {
        container.classList.add('light-theme');
      }
    }
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /** ------------------ RECONOCIMIENTO DE VOZ ------------------ **/

  private recognition: any;

  inicializarReconocimientoVoz(): void {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'es-ES';

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.mensajeActual = transcript;
        this.enviarMensaje();
      };

      this.recognition.onerror = (event: any) => {
        console.error('Error en reconocimiento de voz:', event.error);
        this.grabando = false;
      };

      this.recognition.onend = () => {
        this.grabando = false;
      };
    }
  }

  toggleGrabacion(): void {
    if (!this.recognition) {
      this.translate.get('CHATBOT.VOICE_NOT_SUPPORTED').subscribe((msg: string) => {
        this.agregarMensaje(msg, false);
      });
      return;
    }

    if (this.grabando) {
      this.recognition.stop();
      this.grabando = false;
    } else {
      this.recognition.start();
      this.grabando = true;
    }
  }

  /** ------------------ CLIMA ------------------ **/

  cargarClima(): void {
    this.http.get<Clima>(this.baseUrlClima).subscribe({
      next: (clima) => {
        this.clima = clima;
      },
      error: () => {
        // Datos de clima por defecto en caso de error
        this.clima = {
          temperatura: 24,
          descripcion: 'Parcialmente nublado',
          humedad: 65,
          icono: '⛅',
        };
      },
    });
  }

  /** ------------------ NAVEGACIÓN ------------------ **/

  volver(): void {
    this.router.navigate(['/']);
  }
}
