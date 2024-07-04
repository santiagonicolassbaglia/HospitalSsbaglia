import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { HistoriaClinica } from '../../clases/historia-clinica';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hist-clinica-admin',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, DatePipe],
  providers: [DatePipe], // Proporcionar DatePipe aquí
  templateUrl: './hist-clinica-admin.component.html',
  styleUrls: ['./hist-clinica-admin.component.css']
})
export class HistClinicaAdminComponent implements OnInit {

  historiasClinicas: HistoriaClinica[] = [];
  historiasClinicasFiltradas: HistoriaClinica[] = [];
  filtro: string = '';

  constructor(
    private historiaClinicaService: HistoriaClinicaService,
    private datePipe: DatePipe // Inyectar DatePipe aquí
  ) { }

  ngOnInit(): void {
    this.historiaClinicaService.obtenerTodasHistorias().subscribe(historial => {
      this.historiasClinicas = historial.map(e => {
        const data = e.payload.doc.data() as HistoriaClinica;
        data.id = e.payload.doc.id;
        data.fecha = this.convertTimestampToDate(data.fecha); // Convertir Timestamp a Date
        return data;
      }).sort((a, b) => b.fecha.getTime() - a.fecha.getTime()); // Ordenar por fecha descendente
      this.historiasClinicasFiltradas = this.historiasClinicas;
    });
  }

  private convertTimestampToDate(timestamp: any): Date {
    return timestamp instanceof Date ? timestamp : timestamp.toDate();
  }

  aplicarFiltro(): void {
    const filtro = this.filtro.toLowerCase();
    this.historiasClinicasFiltradas = this.historiasClinicas.filter(historia =>
      historia.nombrePaciente.toLowerCase().includes(filtro) ||
      historia.nombreEspecialista.toLowerCase().includes(filtro) ||
      this.dateToString(historia.fecha).includes(filtro)
    );
  }

  private dateToString(date: Date): string {
    return this.datePipe.transform(date, 'shortDate')?.toLowerCase() || '';
  }

  exportarSeleccionados(): void {
    const seleccionados = this.historiasClinicasFiltradas.filter(historia => historia.seleccionado);
    if (seleccionados.length === 0) {
      alert('No hay historias clínicas seleccionadas.');
      return;
    }

    const datosParaExportar = seleccionados.map(historia => ({
      Fecha: this.dateToString(historia.fecha),
      Paciente: historia.nombrePaciente,
      Especialista: historia.nombreEspecialista,
      Altura: historia.altura + ' cm',
      Peso: historia.peso + ' kg',
      Temperatura: historia.temperatura + ' °C',
      Presión: historia.presion,
      ...historia.datosDinamicos.reduce((acc, dato) => ({ ...acc, [dato.clave]: dato.valor }), {})
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaExportar);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Historias Clínicas');

    XLSX.writeFile(wb, 'historias_clinicas_seleccionadas.xlsx');
  }
}
