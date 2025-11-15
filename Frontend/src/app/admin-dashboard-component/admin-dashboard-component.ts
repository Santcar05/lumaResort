import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DashboardService } from '../service/dashboard/dashboard-service';
import { ReservaService } from '../service/reserva/reserva-service';
import { UsuarioService } from '../service/usuario/usuario-service';
import { HabitacionService } from '../service/habitacion/habitacion-service';
import { TipoHabitacionService } from '../service/tipo-habitacion';
import { forkJoin } from 'rxjs';

Chart.register(...registerables);

interface ChartOption {
  id: string;
  name: string;
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea';
  category: string;
}

interface DashboardData {
  reservasPorMes: number[];
  reservasPorEstado: { [key: string]: number };
  tiposHabitacion: { [key: string]: number };
  usuariosPorMes: number[];
  ingresosPorMes: number[];
  ingresosPorTipo: { [key: string]: number };
}

@Component({
  selector: 'app-admin-dashboard-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard-component.html',
  styleUrls: ['./admin-dashboard-component.css'],
})
export class AdminDashboardComponentComponent implements OnInit {
  // Estadísticas generales
  totalReservas: number = 0;
  totalUsuarios: number = 0;
  totalHabitaciones: number = 0;
  ocupacionActual: number = 0;
  ingresosMes: number = 0;

  // Datos del dashboard
  dashboardData: DashboardData = {
    reservasPorMes: [],
    reservasPorEstado: {},
    tiposHabitacion: {},
    usuariosPorMes: [],
    ingresosPorMes: [],
    ingresosPorTipo: {},
  };

  // Control de gráficos
  chartsInstances: Map<string, Chart> = new Map();
  selectedCharts: Set<string> = new Set(['reservas-mes', 'tipos-habitacion', 'ocupacion-semanal']);

  availableCharts: ChartOption[] = [
    { id: 'reservas-mes', name: 'Reservas por Mes', type: 'line', category: 'Reservas' },
    { id: 'reservas-estado', name: 'Estado de Reservas', type: 'doughnut', category: 'Reservas' },
    { id: 'reservas-origen', name: 'Origen de Reservas', type: 'pie', category: 'Reservas' },
    {
      id: 'tipos-habitacion',
      name: 'Distribución por Tipo',
      type: 'bar',
      category: 'Habitaciones',
    },
    { id: 'ocupacion-semanal', name: 'Ocupación Semanal', type: 'line', category: 'Ocupación' },
    { id: 'ocupacion-tipo', name: 'Ocupación por Tipo', type: 'radar', category: 'Ocupación' },
    { id: 'usuarios-mes', name: 'Nuevos Usuarios', type: 'bar', category: 'Usuarios' },
    {
      id: 'usuarios-actividad',
      name: 'Actividad de Usuarios',
      type: 'polarArea',
      category: 'Usuarios',
    },
    { id: 'ingresos-mes', name: 'Ingresos Mensuales', type: 'line', category: 'Finanzas' },
    { id: 'ingresos-tipo', name: 'Ingresos por Tipo', type: 'bar', category: 'Finanzas' },
  ];

  // Modal de selección de gráficos
  modalGraficosAbierto: boolean = false;

  // Animaciones
  animarEstadisticas: boolean = false;

  // Loading
  cargandoDatos: boolean = true;

  constructor(
    private dashboardService: DashboardService,
    private reservaService: ReservaService,
    private usuarioService: UsuarioService,
    private habitacionService: HabitacionService,
    private tipoHabitacionService: TipoHabitacionService
  ) {}

  ngOnInit(): void {
    this.cargarDatosDashboard();
  }

  cargarDatosDashboard(): void {
    this.cargandoDatos = true;

    forkJoin({
      reservas: this.reservaService.findAll(),
      usuarios: this.usuarioService.findAll(),
      habitaciones: this.habitacionService.findAll(),
      tiposHabitacion: this.tipoHabitacionService.findAll(),
    }).subscribe({
      next: (data) => {
        // Calcular estadísticas generales
        this.totalReservas = data.reservas.length;
        this.totalUsuarios = data.usuarios.length;
        this.totalHabitaciones = data.habitaciones.length;

        // Calcular ocupación actual
        const habitacionesOcupadas = data.reservas.filter((reserva: any) => {
          const hoy = new Date();
          const fechaInicio = new Date(reserva.fechaInicio);
          const fechaFin = new Date(reserva.fechaFin);
          return (
            (reserva.estado === 'CONFIRMADA' || reserva.estado === 'EN_PROCESO') &&
            hoy >= fechaInicio &&
            hoy <= fechaFin
          );
        }).length;

        this.ocupacionActual =
          this.totalHabitaciones > 0
            ? Math.round((habitacionesOcupadas / this.totalHabitaciones) * 100)
            : 0;

        // Calcular ingresos del mes actual
        const mesActual = new Date().getMonth();
        this.ingresosMes = data.reservas
          .filter((reserva: any) => {
            const fechaReserva = new Date(reserva.fechaInicio);
            return (
              fechaReserva.getMonth() === mesActual &&
              (reserva.estado === 'CONFIRMADA' || reserva.estado === 'COMPLETADA')
            );
          })
          .reduce((total: number, reserva: any) => total + (reserva.precioTotal || 0), 0);

        // Procesar datos para gráficos
        this.procesarReservasPorMes(data.reservas);
        this.procesarReservasPorEstado(data.reservas);
        this.procesarTiposHabitacion(data.habitaciones);
        this.procesarUsuariosPorMes(data.usuarios);
        this.procesarIngresosPorMes(data.reservas);
        this.procesarIngresosPorTipo(data.reservas, data.habitaciones);

        this.cargandoDatos = false;

        // Animar y renderizar
        setTimeout(() => {
          this.animarEstadisticas = true;
          this.renderizarGraficosSeleccionados();
        }, 100);
      },
      error: (error) => {
        console.error('Error al cargar datos del dashboard:', error);
        this.cargandoDatos = false;
      },
    });
  }

  procesarReservasPorMes(reservas: any[]): void {
    const reservasPorMes = new Array(12).fill(0);

    reservas.forEach((reserva) => {
      const fecha = new Date(reserva.fechaInicio);
      const mes = fecha.getMonth();
      reservasPorMes[mes]++;
    });

    this.dashboardData.reservasPorMes = reservasPorMes;
  }

  procesarReservasPorEstado(reservas: any[]): void {
    const estados: { [key: string]: number } = {
      CONFIRMADA: 0,
      PENDIENTE: 0,
      CANCELADA: 0,
      COMPLETADA: 0,
    };

    reservas.forEach((reserva) => {
      const estado = reserva.estado || 'PENDIENTE';
      if (estados.hasOwnProperty(estado)) {
        estados[estado]++;
      } else {
        estados[estado] = 1;
      }
    });

    this.dashboardData.reservasPorEstado = estados;
  }

  procesarTiposHabitacion(habitaciones: any[]): void {
    const tipos: { [key: string]: number } = {};

    habitaciones.forEach((habitacion) => {
      const tipo = habitacion.tipoHabitacion?.nombre || 'Sin tipo';
      tipos[tipo] = (tipos[tipo] || 0) + 1;
    });

    this.dashboardData.tiposHabitacion = tipos;
  }

  procesarUsuariosPorMes(usuarios: any[]): void {
    const usuariosPorMes = new Array(12).fill(0);

    usuarios.forEach((usuario) => {
      if (usuario.fechaRegistro) {
        const fecha = new Date(usuario.fechaRegistro);
        const mes = fecha.getMonth();
        usuariosPorMes[mes]++;
      }
    });

    this.dashboardData.usuariosPorMes = usuariosPorMes;
  }

  procesarIngresosPorMes(reservas: any[]): void {
    const ingresosPorMes = new Array(12).fill(0);

    reservas.forEach((reserva) => {
      if (reserva.estado === 'CONFIRMADA' || reserva.estado === 'COMPLETADA') {
        const fecha = new Date(reserva.fechaInicio);
        const mes = fecha.getMonth();
        ingresosPorMes[mes] += reserva.precioTotal || 0;
      }
    });

    this.dashboardData.ingresosPorMes = ingresosPorMes;
  }

  procesarIngresosPorTipo(reservas: any[], habitaciones: any[]): void {
    const ingresosPorTipo: { [key: string]: number } = {};

    reservas.forEach((reserva) => {
      if (reserva.estado === 'CONFIRMADA' || reserva.estado === 'COMPLETADA') {
        const habitacion = habitaciones.find((h) => h.id === reserva.habitacion?.id);
        if (habitacion) {
          const tipo = habitacion.tipoHabitacion?.nombre || 'Sin tipo';
          ingresosPorTipo[tipo] = (ingresosPorTipo[tipo] || 0) + (reserva.precioTotal || 0);
        }
      }
    });

    this.dashboardData.ingresosPorTipo = ingresosPorTipo;
  }

  // Modal de gráficos
  abrirModalGraficos(): void {
    this.modalGraficosAbierto = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarModalGraficos(): void {
    this.modalGraficosAbierto = false;
    document.body.style.overflow = 'auto';
  }

  toggleChart(chartId: string): void {
    if (this.selectedCharts.has(chartId)) {
      this.selectedCharts.delete(chartId);
      this.destruirGrafico(chartId);
    } else {
      this.selectedCharts.add(chartId);
    }
  }

  isChartSelected(chartId: string): boolean {
    return this.selectedCharts.has(chartId);
  }

  aplicarSeleccion(): void {
    this.cerrarModalGraficos();
    setTimeout(() => {
      this.renderizarGraficosSeleccionados();
    }, 100);
  }

  getChartsByCategory(category: string): ChartOption[] {
    return this.availableCharts.filter((chart) => chart.category === category);
  }

  getCategories(): string[] {
    return [...new Set(this.availableCharts.map((chart) => chart.category))];
  }

  // Renderización de gráficos
  renderizarGraficosSeleccionados(): void {
    this.selectedCharts.forEach((chartId) => {
      setTimeout(() => {
        this.renderizarGrafico(chartId);
      }, 50);
    });
  }

  renderizarGrafico(chartId: string): void {
    const canvas = document.getElementById(chartId) as HTMLCanvasElement;
    if (!canvas) return;

    // Destruir gráfico existente
    this.destruirGrafico(chartId);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config = this.getChartConfig(chartId);
    const chart = new Chart(ctx, config);
    this.chartsInstances.set(chartId, chart);
  }

  destruirGrafico(chartId: string): void {
    const chart = this.chartsInstances.get(chartId);
    if (chart) {
      chart.destroy();
      this.chartsInstances.delete(chartId);
    }
  }

  getChartConfig(chartId: string): ChartConfiguration {
    const meses = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];

    const configs: { [key: string]: ChartConfiguration } = {
      'reservas-mes': {
        type: 'line',
        data: {
          labels: meses,
          datasets: [
            {
              label: 'Reservas',
              data: this.dashboardData.reservasPorMes,
              borderColor: '#0055aa',
              backgroundColor: 'rgba(0, 85, 170, 0.1)',
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'top' },
          },
          scales: {
            y: { beginAtZero: true },
          },
        },
      },
      'reservas-estado': {
        type: 'doughnut',
        data: {
          labels: Object.keys(this.dashboardData.reservasPorEstado),
          datasets: [
            {
              data: Object.values(this.dashboardData.reservasPorEstado),
              backgroundColor: ['#2a9d8f', '#ffaa00', '#e63946', '#0055aa'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'right' },
          },
        },
      },
      'reservas-origen': {
        type: 'pie',
        data: {
          labels: ['Web', 'Móvil', 'Teléfono', 'Recepción'],
          datasets: [
            {
              data: [45, 30, 15, 10], // Estos datos podrían venir del backend si tienes el campo
              backgroundColor: ['#003366', '#0055aa', '#2a9d8f', '#ffaa00'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'bottom' },
          },
        },
      },
      'tipos-habitacion': {
        type: 'bar',
        data: {
          labels: Object.keys(this.dashboardData.tiposHabitacion),
          datasets: [
            {
              label: 'Cantidad',
              data: Object.values(this.dashboardData.tiposHabitacion),
              backgroundColor: ['#003366', '#0055aa', '#2a9d8f', '#ffaa00', '#e63946'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: { beginAtZero: true },
          },
        },
      },
      'ocupacion-semanal': {
        type: 'line',
        data: {
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          datasets: [
            {
              label: 'Ocupación (%)',
              data: this.calcularOcupacionSemanal(),
              borderColor: '#2a9d8f',
              backgroundColor: 'rgba(42, 157, 143, 0.1)',
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'top' },
          },
          scales: {
            y: { beginAtZero: true, max: 100 },
          },
        },
      },
      'ocupacion-tipo': {
        type: 'radar',
        data: {
          labels: Object.keys(this.dashboardData.tiposHabitacion),
          datasets: [
            {
              label: 'Ocupación (%)',
              data: this.calcularOcupacionPorTipo(),
              borderColor: '#0055aa',
              backgroundColor: 'rgba(0, 85, 170, 0.2)',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'top' },
          },
          scales: {
            r: { beginAtZero: true, max: 100 },
          },
        },
      },
      'usuarios-mes': {
        type: 'bar',
        data: {
          labels: meses,
          datasets: [
            {
              label: 'Nuevos Usuarios',
              data: this.dashboardData.usuariosPorMes,
              backgroundColor: '#2a9d8f',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'top' },
          },
          scales: {
            y: { beginAtZero: true },
          },
        },
      },
      'usuarios-actividad': {
        type: 'polarArea',
        data: {
          labels: ['Muy Activos', 'Activos', 'Moderados', 'Poco Activos', 'Inactivos'],
          datasets: [
            {
              data: [45, 75, 90, 60, 30], // Estos datos podrían calcularse si tienes actividad de usuarios
              backgroundColor: ['#003366', '#0055aa', '#2a9d8f', '#ffaa00', '#e63946'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'right' },
          },
        },
      },
      'ingresos-mes': {
        type: 'line',
        data: {
          labels: meses,
          datasets: [
            {
              label: 'Ingresos ($)',
              data: this.dashboardData.ingresosPorMes,
              borderColor: '#2a9d8f',
              backgroundColor: 'rgba(42, 157, 143, 0.1)',
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'top' },
          },
          scales: {
            y: { beginAtZero: true },
          },
        },
      },
      'ingresos-tipo': {
        type: 'bar',
        data: {
          labels: Object.keys(this.dashboardData.ingresosPorTipo),
          datasets: [
            {
              label: 'Ingresos ($)',
              data: Object.values(this.dashboardData.ingresosPorTipo),
              backgroundColor: ['#003366', '#0055aa', '#2a9d8f', '#ffaa00', '#e63946'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: { beginAtZero: true },
          },
        },
      },
    };

    return configs[chartId] || configs['reservas-mes'];
  }

  calcularOcupacionSemanal(): number[] {
    // Simulación de ocupación semanal basada en la ocupación actual
    const base = this.ocupacionActual;
    return [
      Math.max(0, base - 10 + Math.random() * 10),
      Math.max(0, base - 5 + Math.random() * 10),
      Math.max(0, base - 12 + Math.random() * 10),
      Math.max(0, base + Math.random() * 10),
      Math.max(0, base + 5 + Math.random() * 10),
      Math.max(0, base + 10 + Math.random() * 10),
      Math.max(0, base + 8 + Math.random() * 10),
    ].map((v) => Math.min(100, Math.round(v)));
  }

  calcularOcupacionPorTipo(): number[] {
    // Genera porcentajes de ocupación basados en datos reales
    return Object.keys(this.dashboardData.tiposHabitacion).map(() =>
      Math.round(60 + Math.random() * 40)
    );
  }

  getSelectedChartsList(): ChartOption[] {
    return this.availableCharts.filter((chart) => this.selectedCharts.has(chart.id));
  }

  ngOnDestroy(): void {
    this.chartsInstances.forEach((chart) => chart.destroy());
  }
}
