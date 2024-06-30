import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../../services/turno.service';
import { KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [ NgIf, FormsModule,NgFor,KeyValuePipe],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent implements OnInit {
  turnosPorEspecialidad: any;
  turnosPorDia: any;
  turnosPorMedicoSolicitados: any;
  turnosFinalizadosPorMedico: any;
  logIngresos: any;

  constructor(private turnoService: TurnoService, private authService: AuthService) { }

  ngOnInit(): void {
    this.obtenerLogIngresos();
    this.obtenerTurnosPorEspecialidad();
    this.obtenerTurnosPorDia();
    this.obtenerTurnosPorMedico('solicitados');
    this.obtenerTurnosFinalizadosPorMedico('finalizados');


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
    });
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
  
  // Descargar PDF
  descargarPDF(estadistica: any, nombreArchivo: string): void {
    const doc = new jsPDF();
    if (estadistica) {
      const headers = ['Día', 'Cantidad'];
      const data = Object.entries(estadistica).map(([key, value]) => [key, value]);
      let startY = 20;
      const startX = 10;
      const lineHeight = 10;
  
      doc.setFontSize(12);
      doc.text('Estadísticas', startX, startY);
  
      data.forEach(([day, count]) => {
        startY += lineHeight;
        doc.text(`${day}, ${count}`, startX, startY);
  
        if (startY >= doc.internal.pageSize.height - 20) {
          doc.addPage();
          startY = 20;
        }
      });
  
      doc.save(`${nombreArchivo}.pdf`);
    } else {
      console.error(`No se pudo descargar ${nombreArchivo} porque estadistica es undefined o null.`);
    }
  }
  descargarEstadisticasExcel(): void {
    this.descargarExcel(this.logIngresos, 'log_ingresos');
    this.descargarExcel(this.turnosPorEspecialidad, 'turnos_por_especialidad');
    this.descargarExcel(this.turnosPorDia, 'turnos_por_dia');
    this.descargarExcel(this.turnosPorMedicoSolicitados, 'turnos_solicitados_por_medico');
    this.descargarExcel(this.turnosFinalizadosPorMedico, 'turnos_finalizados_por_medico');


  }

  descargarEstadisticasPDF(): void {
    this.descargarPDF(this.logIngresos, 'log_ingresos');
    this.descargarPDF(this.turnosPorEspecialidad, 'turnos_por_especialidad');
    this.descargarPDF(this.turnosPorDia, 'turnos_por_dia');
    this.descargarPDF(this.turnosPorMedicoSolicitados, 'turnos_solicitados_por_medico');
    this.descargarPDF(this.turnosFinalizadosPorMedico, 'turnos_finalizados_por_medico');


  }
}