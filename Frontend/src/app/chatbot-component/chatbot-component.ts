import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../generales-components/header-component/header-component';

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
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './chatbot-component.html',
  styleUrls: ['./chatbot-component.css'],
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
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

  // Referencias del DOM
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;
  @ViewChild('mensajeInput') private mensajeInput!: ElementRef;

  /** ------------------ URLs DEL BACKEND ------------------ **/
  private baseUrlChatbot = 'http://localhost:8080/api/chatbot';
  private baseUrlClima = 'http://localhost:8080/api/clima';

  constructor(private http: HttpClient, private router: Router) {}

  /** ------------------ CICLO DE VIDA ------------------ **/
  ngOnInit(): void {
    this.cargarClima();
    this.inicializarReconocimientoVoz();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
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
        this.agregarMensaje(
          'Lo siento, estoy teniendo problemas para conectarme. Por favor, intenta nuevamente en unos momentos.',
          false
        );
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
    // Mantener solo el mensaje de bienvenida
    this.agregarMensaje(
      '¡Hola! Soy Luma, tu asistente virtual. ¿En qué puedo ayudarte hoy?',
      false
    );
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
      this.agregarMensaje(
        'Tu navegador no soporta reconocimiento de voz. Por favor, usa Chrome o Edge.',
        false
      );
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
