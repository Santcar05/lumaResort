import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnDestroy,
  ChangeDetectorRef, // ✅ Añadir
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
  tipo?: 'texto' | 'imagen' | 'audio';
  archivoUrl?: string;
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
  @ViewChild('fileInput') private fileInput!: ElementRef;

  // Reconocimiento de voz
  private recognition: any;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  /** ------------------ URLs DEL BACKEND ------------------ **/
  private baseUrlChatbot = 'https://backend-lumaresort.onrender.com/api/chatbot';
  private baseUrlClima = 'https://backend-lumaresort.onrender.com/api/clima';
  private baseUrlUpload = 'https://backend-lumaresort.onrender.com/api/chatbot/upload';

  constructor(
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef // ✅ Inyectar ChangeDetectorRef
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
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
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
    this.agregarMensaje(mensaje, true, 'texto');
    this.mensajeActual = '';
    this.enviando = true;

    // Simular escritura del bot
    this.escribiendo = true;

    // Enviar al backend
    this.http.post<any>(this.baseUrlChatbot, { mensaje }).subscribe({
      next: (response) => {
        this.escribiendo = false;
        this.enviando = false;
        this.agregarMensaje(response.respuesta, false, 'texto');
        this.cdr.detectChanges();
      },
      error: () => {
        this.escribiendo = false;
        this.enviando = false;
        this.translate.get('CHATBOT.ERROR_MESSAGE').subscribe((errorMsg: string) => {
          this.agregarMensaje(errorMsg, false, 'texto');
        });
      },
    });
  }

  agregarMensaje(
    contenido: string,
    esUsuario: boolean,
    tipo: 'texto' | 'imagen' | 'audio' = 'texto',
    archivoUrl?: string
  ): void {
    this.mensajes.push({
      contenido,
      esUsuario,
      timestamp: new Date(),
      tipo,
      archivoUrl,
    });

    // Forzar detección de cambios inmediatamente
    this.cdr.detectChanges();
  }

  sugerirConsulta(consulta: string): void {
    this.mensajeActual = consulta;
    this.enviarMensaje();
  }

  limpiarChat(): void {
    this.mensajes = [];
    this.cdr.detectChanges();
  }

  formatearMensaje(contenido: string): string {
    // Formatear URLs como enlaces
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return contenido.replace(urlRegex, '<a href="$1" target="_blank" class="message-link">$1</a>');
  }

  /** ------------------ SUBIR IMAGEN ------------------ **/

  abrirSelectorArchivo(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      this.translate.get('CHATBOT.INVALID_FILE_TYPE').subscribe((msg: string) => {
        this.agregarMensaje(msg, false, 'texto');
      });
      return;
    }

    // Validar tamaño
    if (file.size > maxSize) {
      this.translate.get('CHATBOT.FILE_TOO_LARGE').subscribe((msg: string) => {
        this.agregarMensaje(msg, false, 'texto');
      });
      return;
    }

    // Mostrar preview de la imagen INMEDIATAMENTE
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.agregarMensaje('Imagen enviada', true, 'imagen', e.target.result);
      this.cdr.detectChanges(); // ✅ Forzar actualización
    };
    reader.readAsDataURL(file);

    // Subir al backend
    this.subirArchivo(file);

    // Limpiar input
    input.value = '';
  }

  private subirArchivo(file: File): void {
    this.enviando = true;
    this.escribiendo = true;
    this.cdr.detectChanges(); // ✅ Mostrar indicador de "escribiendo"

    const formData = new FormData();
    formData.append('file', file);

    this.http.post<any>(this.baseUrlUpload, formData).subscribe({
      next: (response) => {
        this.escribiendo = false;
        this.enviando = false;

        if (response.respuesta) {
          this.agregarMensaje(response.respuesta, false, 'texto');
        } else {
          this.translate.get('CHATBOT.IMAGE_PROCESSED').subscribe((msg: string) => {
            this.agregarMensaje(msg, false, 'texto');
          });
        }
      },
      error: (err) => {
        console.error('Error al subir archivo:', err);
        this.escribiendo = false;
        this.enviando = false;
        this.translate.get('CHATBOT.UPLOAD_ERROR').subscribe((msg: string) => {
          this.agregarMensaje(msg, false, 'texto');
        });
      },
    });
  }

  /** ------------------ GRABACIÓN DE AUDIO ------------------ **/

  async toggleGrabacion(): Promise<void> {
    if (this.grabando) {
      this.detenerGrabacion();
    } else {
      await this.iniciarGrabacion();
    }
  }

  private async iniciarGrabacion(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });

        // Procesar audio inmediatamente después de detener
        this.procesarAudio(audioBlob);

        // Detener el stream
        stream.getTracks().forEach((track) => track.stop());
      };

      this.mediaRecorder.start();
      this.grabando = true;
      this.cdr.detectChanges(); // Actualizar UI inmediatamente

      console.log('🎤 Grabación iniciada');
    } catch (error) {
      console.error('Error al acceder al micrófono:', error);
      this.translate.get('CHATBOT.MICROPHONE_ERROR').subscribe((msg: string) => {
        this.agregarMensaje(msg, false, 'texto');
      });
    }
  }

  private detenerGrabacion(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.grabando = false;
      this.cdr.detectChanges(); // Actualizar botón inmediatamente
      console.log('⏹️ Grabación detenida');
    }
  }

  private procesarAudio(audioBlob: Blob): void {
    // Crear URL temporal y mostrar INMEDIATAMENTE en el chat
    const audioUrl = URL.createObjectURL(audioBlob);
    this.agregarMensaje('Audio grabado', true, 'audio', audioUrl);

    // Forzar actualización para que aparezca el mensaje de audio
    this.cdr.detectChanges();

    // Enviar al backend para procesar
    this.enviarAudio(audioBlob);
  }

  private enviarAudio(audioBlob: Blob): void {
    this.enviando = true;
    this.escribiendo = true;
    this.cdr.detectChanges(); // Mostrar indicador "escribiendo..." inmediatamente

    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm');

    this.http.post<any>(`${this.baseUrlChatbot}/audio`, formData).subscribe({
      next: (response) => {
        this.escribiendo = false;
        this.enviando = false;

        if (response.transcripcion) {
          // Mostrar transcripción
          this.agregarMensaje(`Transcripción: "${response.transcripcion}"`, false, 'texto');
        }

        if (response.respuesta) {
          // Mostrar respuesta del bot
          this.agregarMensaje(response.respuesta, false, 'texto');
        }

        this.cdr.detectChanges(); // Actualizar después de recibir respuesta
      },
      error: (err) => {
        console.error('Error al procesar audio:', err);
        this.escribiendo = false;
        this.enviando = false;
        this.translate.get('CHATBOT.AUDIO_ERROR').subscribe((msg: string) => {
          this.agregarMensaje(msg, false, 'texto');
        });
      },
    });
  }

  /** ------------------ RECONOCIMIENTO DE VOZ (ALTERNATIVO) ------------------ **/

  inicializarReconocimientoVoz(): void {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = this.translate.currentLang || 'es-ES';

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.mensajeActual = transcript;
        this.enviarMensaje();
      };

      this.recognition.onerror = (event: any) => {
        console.error('Error en reconocimiento de voz:', event.error);
      };

      this.recognition.onend = () => {
        // El reconocimiento se detuvo
      };
    }
  }

  usarReconocimientoVozTexto(): void {
    if (!this.recognition) {
      this.translate.get('CHATBOT.VOICE_NOT_SUPPORTED').subscribe((msg: string) => {
        this.agregarMensaje(msg, false, 'texto');
      });
      return;
    }

    this.recognition.start();
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

  /** ------------------ CLIMA ------------------ **/

  cargarClima(): void {
    this.http.get<Clima>(this.baseUrlClima).subscribe({
      next: (clima) => {
        this.clima = clima;
        this.cdr.detectChanges();
      },
      error: () => {
        this.clima = {
          temperatura: 24,
          descripcion: 'Parcialmente nublado',
          humedad: 65,
          icono: '⛅',
        };
        this.cdr.detectChanges();
      },
    });
  }

  /** ------------------ NAVEGACIÓN ------------------ **/

  volver(): void {
    this.router.navigate(['/']);
  }
}
