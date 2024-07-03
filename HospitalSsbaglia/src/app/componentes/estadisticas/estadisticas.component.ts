import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../../services/turno.service';
import { KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { OrdenarDatosPipe } from '../../pipes/ordenar-datos.pipe';
import { FechaPipe } from '../../pipes/fecha.pipe';
import { FiltrarDatosPipe } from '../../pipes/filtrar-datos.pipe';
import { Chart, ChartData, ChartType } from 'chart.js/auto';
import { ChartComponent } from '../chart/chart.component';
 
@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [NgIf, FormsModule, NgFor, KeyValuePipe, OrdenarDatosPipe, FechaPipe, FiltrarDatosPipe, ChartComponent],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent implements OnInit {
  turnosPorEspecialidad: any;
  turnosPorDia: any;
  turnosPorMedicoSolicitados: any;
  turnosFinalizadosPorMedico: any;
  logIngresos: any;

  mostrarTurnosPorEspecialidad = false;
  mostrarTurnosPorDia = false;
  mostrarTurnosPorMedicoSolicitados = false;
  mostrarTurnosFinalizadosPorMedico = false;

  constructor(private turnoService: TurnoService, private authService: AuthService) {}

  ngOnInit(): void {}

  obtenerLogIngresos(): void {
    this.authService.getLogIngresos().subscribe(logs => {
      this.logIngresos = logs.reduce((acc, log) => {
        const fecha = log.timestamp instanceof Date
          ? log.timestamp.toLocaleDateString()
          : new Date(log.timestamp.seconds * 1000).toLocaleDateString();
        acc[fecha] = (acc[fecha] || 0) + 1;
        return acc;
      }, {});
      this.guardarEstadisticas('logIngresos', this.logIngresos);
    });
  }

  obtenerTurnosPorEspecialidad(): void {
    this.mostrarTurnosPorEspecialidad = !this.mostrarTurnosPorEspecialidad;
    if (this.mostrarTurnosPorEspecialidad) {
      this.turnoService.getTurnos().subscribe(turnos => {
        this.turnosPorEspecialidad = turnos.reduce((acc, turno) => {
          acc[turno.especialidad] = (acc[turno.especialidad] || 0) + 1;
          return acc;
        }, {});
        this.guardarEstadisticas('turnosPorEspecialidad', this.turnosPorEspecialidad);
        this.generarGrafico('chartEspecialidad', 'Cantidad de turnos por especialidad', Object.keys(this.turnosPorEspecialidad), Object.values(this.turnosPorEspecialidad));
      });
    }
  }

  obtenerTurnosPorDia(): void {
    this.mostrarTurnosPorDia = !this.mostrarTurnosPorDia;
    if (this.mostrarTurnosPorDia) {
      this.turnoService.getTurnos().subscribe(turnos => {
        this.turnosPorDia = turnos.reduce((acc, turno) => {
          const fecha = turno.fechaHora instanceof Date
            ? turno.fechaHora.toLocaleDateString()
            : new Date(turno.fechaHora).toLocaleDateString();
          acc[fecha] = (acc[fecha] || 0) + 1;
          return acc;
        }, {});
        this.guardarEstadisticas('turnosPorDia', this.turnosPorDia);
        this.generarGrafico('chartDia', 'Cantidad de turnos por día', Object.keys(this.turnosPorDia), Object.values(this.turnosPorDia));
      });
    }
  }

  obtenerTurnosPorMedico(lapso: string): void {
    this.mostrarTurnosPorMedicoSolicitados = !this.mostrarTurnosPorMedicoSolicitados;
    if (this.mostrarTurnosPorMedicoSolicitados) {
      this.turnoService.getTurnos().subscribe(turnos => {
        this.turnosPorMedicoSolicitados = turnos.reduce((acc, turno) => {
          if (lapso === 'solicitados') {
            acc[turno.especialistaNombre] = (acc[turno.especialistaNombre] || 0) + 1;
          }
          return acc;
        }, {});
        this.guardarEstadisticas('turnosPorMedicoSolicitados', this.turnosPorMedicoSolicitados);
        this.generarGrafico('chartMedicoSolicitados', 'Cantidad de turnos solicitados por médico', Object.keys(this.turnosPorMedicoSolicitados), Object.values(this.turnosPorMedicoSolicitados));
      });
    }
  }

  obtenerTurnosFinalizadosPorMedico(lapso: string): void {
    this.mostrarTurnosFinalizadosPorMedico = !this.mostrarTurnosFinalizadosPorMedico;
    if (this.mostrarTurnosFinalizadosPorMedico) {
      this.turnoService.getTurnos().subscribe(turnos => {
        this.turnosFinalizadosPorMedico = turnos.reduce((acc, turno) => {
          if (turno.estado === 'realizado' && lapso === 'finalizados') {
            acc[turno.especialistaNombre] = (acc[turno.especialistaNombre] || 0) + 1;
          }
          return acc;
        }, {});
        this.guardarEstadisticas('turnosFinalizadosPorMedico', this.turnosFinalizadosPorMedico);
        this.generarGrafico('chartMedicoFinalizados', 'Cantidad de turnos finalizados por médico', Object.keys(this.turnosFinalizadosPorMedico), Object.values(this.turnosFinalizadosPorMedico));
      });
    }
  }

  generarGrafico(idCanvas: string, titulo: string, labels: string[], data: number[]): void {
    const canvas = document.getElementById(idCanvas) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: titulo,
          data: data,
          backgroundColor: this.generarColores(data.length)
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.raw) {
                  label += context.raw.toLocaleString();
                }
                return label;
              }
            }
          }
        }
      }
    });
  }

  generarColores(cantidad: number): string[] {
    // Genera un arreglo de colores aleatorios en formato hexadecimal
    return Array.from({ length: cantidad }, () => '#' + Math.floor(Math.random() * 16777215).toString(16));
  }

  guardarEstadisticas(tipo: string, data: any): void {
    localStorage.setItem(tipo, JSON.stringify(data));
    console.log(`Estadísticas guardadas: ${tipo}`);
  }

  descargarEstadisticasExcel(): void {
    const estadisticas = [
      { title: 'Log de ingresos', data: this.logIngresos },
      { title: 'Turnos por especialidad', data: this.turnosPorEspecialidad },
      { title: 'Turnos por día', data: this.turnosPorDia },
      { title: 'Turnos solicitados por médico', data: this.turnosPorMedicoSolicitados },
      { title: 'Turnos finalizados por médico', data: this.turnosFinalizadosPorMedico },
    ];

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    estadisticas.forEach(est => {
      if (est.data) {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
          Object.entries(est.data).map(([key, value]) => ({ Clave: key, Cantidad: value }))
        );
        XLSX.utils.book_append_sheet(wb, ws, est.title);
      }
    });

    XLSX.writeFile(wb, 'estadisticas.xlsx');
  }

  descargarEstadisticasPDF(): void {
    const doc = new jsPDF();
    let currentY = 10;

    const addTitleToPDF = (title: string) => {
      doc.setFontSize(16);
      doc.text(title, 10, currentY);
      currentY += 10;
      doc.setFontSize(12);
    };

    const addDataToPDF = (data: any[]) => {
      data.forEach(row => {
        doc.text(`${row[0]}: ${row[1]}`, 10, currentY);
        currentY += 10;
        if (currentY > 280) {
          doc.addPage();
          currentY = 10;
        }
      });
      currentY += 10;
    };

    const estadisticas = [
      { title: 'Log de ingresos', data: this.logIngresos },
      { title: 'Turnos por especialidad', data: this.turnosPorEspecialidad },
      { title: 'Turnos por día', data: this.turnosPorDia },
      { title: 'Turnos solicitados por médico', data: this.turnosPorMedicoSolicitados },
      { title: 'Turnos finalizados por médico', data: this.turnosFinalizadosPorMedico },
    ];

    estadisticas.forEach(est => {
      if (est.data) {
        addTitleToPDF(est.title);
        addDataToPDF(Object.entries(est.data));
      }
    });

    doc.save('estadisticas.pdf');
  }
}
