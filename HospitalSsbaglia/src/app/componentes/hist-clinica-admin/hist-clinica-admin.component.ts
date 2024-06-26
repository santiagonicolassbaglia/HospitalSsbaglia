import { Component, OnInit } from '@angular/core';
import { HistoriaClinica } from '../../clases/historia-clinica';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hist-clinica-admin',
  standalone: true,
  imports: [NgFor,NgIf,FormsModule, DatePipe ],
  templateUrl: './hist-clinica-admin.component.html',
  styleUrl: './hist-clinica-admin.component.css'
})
export class HistClinicaAdminComponent implements OnInit {
   
  historiasClinicas: HistoriaClinica[] = [];
  historiasClinicasFiltradas: HistoriaClinica[] = [];
  filtro: string = '';

  constructor(private historiaClinicaService: HistoriaClinicaService) {}

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
    return new DatePipe('es-AR').transform(date, 'shortDate')?.toLowerCase() || '';
  }
}