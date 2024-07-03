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
  descargando: boolean = false;

  public chartOptions: any = {
    responsive: true,
  };
  public chartLabels: string[] = [];
  public chartData: ChartData<'pie'> = {
    labels: this.chartLabels,
    datasets: [{ data: [] }]
  };
  public chartType: ChartType = 'pie';
  public chartLegend = true;
  public chartPlugins = [];

  mostrarTurnosPorEspecialidad = false;
  mostrarTurnosPorDia = false;
  mostrarTurnosPorMedicoSolicitados = false;
  mostrarTurnosFinalizadosPorMedico = false;
 

  constructor(private turnoService: TurnoService, private authService: AuthService) {}

  ngOnInit(): void {
    // this.obtenerTurnosPorEspecialidad();
    // this.obtenerTurnosPorDia();
    // this.obtenerTurnosPorMedico('solicitados');
    // this.obtenerTurnosFinalizadosPorMedico('finalizados');
  }

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
    this.turnoService.getTurnos().subscribe(turnos => {
      this.turnosPorEspecialidad = turnos.reduce((acc, turno) => {
        acc[turno.especialidad] = (acc[turno.especialidad] || 0) + 1;
        return acc;
      }, {});
      this.guardarEstadisticas('turnosPorEspecialidad', this.turnosPorEspecialidad);
      this.generarGrafico('chartEspecialidad', 'Cantidad de turnos por especialidad', Object.keys(this.turnosPorEspecialidad), Object.values(this.turnosPorEspecialidad));
    });
  }

  obtenerTurnosPorDia(): void {
   
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

  obtenerTurnosPorMedico(lapso: string): void {
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

  obtenerTurnosFinalizadosPorMedico(lapso: string): void {
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

  descargarExcel(estadistica: any, nombreArchivo: string): void {
    if (estadistica) {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        Object.entries(estadistica).map(([key, value]) => ({ Día: key, Cantidad: value }))
      );
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Estadísticas');
      XLSX.writeFile(wb, `${nombreArchivo}.xlsx`);
    } else {
      console.error(`No se pudo descargar ${nombreArchivo} porque estadistica es undefined o null.`);
    }
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

    if (this.logIngresos) {
      addTitleToPDF('Log de Ingresos');
      const logIngresosData = Object.entries(this.logIngresos).map(([key, value]) => [key, value]);
      addDataToPDF(logIngresosData);
    }

    if (this.turnosPorEspecialidad) {
      addTitleToPDF('Turnos por Especialidad');
      const turnosPorEspecialidadData = Object.entries(this.turnosPorEspecialidad).map(([key, value]) => [key, value]);
      addDataToPDF(turnosPorEspecialidadData);
    }

    if (this.turnosPorDia) {
      addTitleToPDF('Turnos por Día');
      const turnosPorDiaData = Object.entries(this.turnosPorDia).map(([key, value]) => [key, value]);
      addDataToPDF(turnosPorDiaData);
    }

    if (this.turnosPorMedicoSolicitados) {
      addTitleToPDF('Turnos Solicitados por Médico');
      const turnosPorMedicoSolicitadosData = Object.entries(this.turnosPorMedicoSolicitados).map(([key, value]) => [key, value]);
      addDataToPDF(turnosPorMedicoSolicitadosData);
    }

    if (this.turnosFinalizadosPorMedico) {
      addTitleToPDF('Turnos Finalizados por Médico');
      const turnosFinalizadosPorMedicoData = Object.entries(this.turnosFinalizadosPorMedico).map(([key, value]) => [key, value]);
      addDataToPDF(turnosFinalizadosPorMedicoData);
    }

    doc.save('Estadisticas.pdf');
  }

  descargarEstadisticasExcel(): void {
    const workbook = XLSX.utils.book_new();

    const addSheetToWorkbook = (sheetName: string, data: any) => {
      const worksheet = XLSX.utils.json_to_sheet(
        Object.entries(data).map(([key, value]) => ({ Clave: key, Valor: value }))
      );
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    };

    if (this.logIngresos) {
      addSheetToWorkbook('Log de Ingresos', this.logIngresos);
    }

    if (this.turnosPorEspecialidad) {
      addSheetToWorkbook('Turnos por Especialidad', this.turnosPorEspecialidad);
    }

    if (this.turnosPorDia) {
      addSheetToWorkbook('Turnos por Día', this.turnosPorDia);
    }

    if (this.turnosPorMedicoSolicitados) {
      addSheetToWorkbook('Turnos Solicitados por Médico', this.turnosPorMedicoSolicitados);
    }

    if (this.turnosFinalizadosPorMedico) {
      addSheetToWorkbook('Turnos Finalizados por Médico', this.turnosFinalizadosPorMedico);
    }

    XLSX.writeFile(workbook, 'Estadisticas.xlsx');
  }

  toggleMostrarTurnosPorEspecialidad(): void {
    this.mostrarTurnosPorEspecialidad = !this.mostrarTurnosPorEspecialidad;
  }

  toggleMostrarTurnosPorDia(): void {
    this.mostrarTurnosPorDia = !this.mostrarTurnosPorDia;
  }

  toggleMostrarTurnosPorMedicoSolicitados(): void {
    this.mostrarTurnosPorMedicoSolicitados = !this.mostrarTurnosPorMedicoSolicitados;
  }

  toggleMostrarTurnosFinalizadosPorMedico(): void {
    this.mostrarTurnosFinalizadosPorMedico = !this.mostrarTurnosFinalizadosPorMedico;
  }
  
}
