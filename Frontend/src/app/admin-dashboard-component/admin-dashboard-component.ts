import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

interface ChartOption {
  id: string;
  name: string;
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea';
  category: string;
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
  totalReservas: number = 156;
  totalUsuarios: number = 342;
  totalHabitaciones: number = 48;
  ocupacionActual: number = 75;
  ingresosMes: number = 45890;

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

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.animarEstadisticas = true;
      this.renderizarGraficosSeleccionados();
    }, 100);
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
    const configs: { [key: string]: ChartConfiguration } = {
      'reservas-mes': {
        type: 'line',
        data: {
          labels: [
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
          ],
          datasets: [
            {
              label: 'Reservas',
              data: [65, 78, 90, 81, 96, 105, 120, 115, 98, 110, 125, 140],
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
          labels: ['Confirmadas', 'Pendientes', 'Canceladas', 'Completadas'],
          datasets: [
            {
              data: [85, 25, 12, 34],
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
              data: [45, 30, 15, 10],
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
          labels: ['Suite', 'Deluxe', 'Estándar', 'Familiar', 'Presidencial'],
          datasets: [
            {
              label: 'Cantidad',
              data: [8, 12, 18, 6, 4],
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
              data: [68, 72, 65, 78, 85, 92, 88],
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
          labels: ['Suite', 'Deluxe', 'Estándar', 'Familiar', 'Presidencial'],
          datasets: [
            {
              label: 'Ocupación (%)',
              data: [85, 75, 90, 70, 95],
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
          labels: [
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
          ],
          datasets: [
            {
              label: 'Nuevos Usuarios',
              data: [25, 32, 28, 35, 40, 38, 45, 42, 48, 50, 55, 60],
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
              data: [45, 75, 90, 60, 30],
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
          labels: [
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
          ],
          datasets: [
            {
              label: 'Ingresos ($)',
              data: [
                32000, 38000, 42000, 39000, 45000, 48000, 52000, 49000, 46000, 50000, 54000, 58000,
              ],
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
          labels: ['Suite', 'Deluxe', 'Estándar', 'Familiar', 'Presidencial'],
          datasets: [
            {
              label: 'Ingresos ($)',
              data: [18000, 15000, 8000, 7000, 12000],
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

  getSelectedChartsList(): ChartOption[] {
    return this.availableCharts.filter((chart) => this.selectedCharts.has(chart.id));
  }

  ngOnDestroy(): void {
    this.chartsInstances.forEach((chart) => chart.destroy());
  }
}
