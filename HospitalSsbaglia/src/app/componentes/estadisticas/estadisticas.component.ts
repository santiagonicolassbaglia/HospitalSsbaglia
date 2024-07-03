import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../../services/turno.service';
import { KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'jspdf-autotable';
import { OrdenarDatosPipe } from '../../pipes/ordenar-datos.pipe';
import { FechaPipe } from '../../pipes/fecha.pipe';
import { FiltrarDatosPipe } from '../../pipes/filtrar-datos.pipe';


@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [ NgIf, FormsModule,NgFor,KeyValuePipe, OrdenarDatosPipe, FechaPipe,FiltrarDatosPipe],
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

  constructor(private turnoService: TurnoService, private authService: AuthService) { }

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
  
  descargarEstadisticasPDF(): void {
    const doc = new jsPDF();
    let currentY = 10; // Starting Y position
  
    const addTitleToPDF = (title: string) => {
      doc.setFontSize(16);
      doc.text(title, 10, currentY);
      currentY += 10; // Add some space after the title
      doc.setFontSize(12);
    };
  
    const addDataToPDF = (data: any[]) => {
      data.forEach(row => {
        doc.text(`${row[0]}: ${row[1]}`, 10, currentY);
        currentY += 10; // Add some space after each row
        if (currentY > 280) { // If currentY exceeds the page height, add a new page
          doc.addPage();
          currentY = 10; // Reset currentY to top of the new page
        }
      });
      currentY += 10; // Add some space after the data
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
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
  
    if (this.logIngresos) {
      const logIngresosSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        Object.entries(this.logIngresos).map(([key, value]) => ({ Día: key, Cantidad: value }))
      );
      XLSX.utils.book_append_sheet(workbook, logIngresosSheet, 'Log de Ingresos');
    }
  
    if (this.turnosPorEspecialidad) {
      const turnosPorEspecialidadSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        Object.entries(this.turnosPorEspecialidad).map(([key, value]) => ({ Especialidad: key, Cantidad: value }))
      );
      XLSX.utils.book_append_sheet(workbook, turnosPorEspecialidadSheet, 'Turnos por Especialidad');
    }
  
    if (this.turnosPorDia) {
      const turnosPorDiaSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        Object.entries(this.turnosPorDia).map(([key, value]) => ({ Día: key, Cantidad: value }))
      );
      XLSX.utils.book_append_sheet(workbook, turnosPorDiaSheet, 'Turnos por Día');
    }
  
    if (this.turnosPorMedicoSolicitados) {
      const turnosPorMedicoSolicitadosSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        Object.entries(this.turnosPorMedicoSolicitados).map(([key, value]) => ({ Médico: key, Cantidad: value }))
      );
      XLSX.utils.book_append_sheet(workbook, turnosPorMedicoSolicitadosSheet, 'Turnos Solicitados por Médico');
    }
  
    if (this.turnosFinalizadosPorMedico) {
      const turnosFinalizadosPorMedicoSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        Object.entries(this.turnosFinalizadosPorMedico).map(([key, value]) => ({ Médico: key, Cantidad: value }))
      );
      XLSX.utils.book_append_sheet(workbook, turnosFinalizadosPorMedicoSheet, 'Turnos Finalizados por Médico');
    }
  
    XLSX.writeFile(workbook, 'Estadisticas.xlsx');
  }
  


  
}