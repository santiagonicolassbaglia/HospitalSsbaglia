import { Component, OnInit } from '@angular/core';
import { HistoriaClinica } from '../../clases/historia-clinica';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hist-clinica-admin',
  standalone: true,
  imports: [NgFor,NgIf,FormsModule, DatePipe],
  templateUrl: './hist-clinica-admin.component.html',
  styleUrl: './hist-clinica-admin.component.css'
})
export class HistClinicaAdminComponent implements OnInit {
  historiasClinicas: HistoriaClinica[] = [];

  constructor(private historiaClinicaService: HistoriaClinicaService) {}

  ngOnInit(): void {
    this.historiaClinicaService.obtenerTodasHistorias().subscribe(historial => {
      this.historiasClinicas = historial.map(e => {
        const data = e.payload.doc.data() as HistoriaClinica;
        data.id = e.payload.doc.id;
        return data;
      });
    });
  }
}