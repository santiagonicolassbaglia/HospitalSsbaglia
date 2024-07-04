import { Component, OnInit } from '@angular/core';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';
import { HistoriaClinica } from '../../clases/historia-clinica';
import { AuthService } from '../../services/auth.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Turno } from '../../clases/turno';
import { FormsModule } from '@angular/forms';
import { FiltrarDatosPipe } from '../../pipes/filtrar-datos.pipe';
 
import { UltimosTresTurnosPipe } from '../../pipes/ultimos-tres-turnos.pipe';

@Component({
  selector: 'app-hist-clinica-especialista',
  standalone: true,
  imports: [DatePipe, NgFor, NgIf, FormsModule, FiltrarDatosPipe, UltimosTresTurnosPipe],
  templateUrl: './hist-clinica-especialista.component.html',
  styleUrls: ['./hist-clinica-especialista.component.css']
})
export class HistClinicaEspecialistaComponent implements OnInit {
  historiasClinicas: HistoriaClinica[] = [];
  especialistaId: string = '';
  filtroGeneral: string = '';
  mostrarUltimasTres: boolean = false;

  constructor(
    private authService: AuthService,
    private historiaClinicaService: HistoriaClinicaService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.especialistaId = user.uid;
        this.cargarHistoriasClinicas(this.especialistaId);
      }
    });
  }

  private cargarHistoriasClinicas(especialistaId: string): void {
    this.historiaClinicaService.obtenerHistoriasPorEspecialista(especialistaId).subscribe(historial => {
      this.historiasClinicas = historial.map(e => {
        const data = e.payload.doc.data() as HistoriaClinica;
        data.id = e.payload.doc.id;
        data.fecha = this.convertTimestampToDate(data.fecha);
        return data;
      });
    });
  }

  private convertTimestampToDate(timestamp: any): Date {
    return timestamp instanceof Date ? timestamp : timestamp.toDate();
  }
}
