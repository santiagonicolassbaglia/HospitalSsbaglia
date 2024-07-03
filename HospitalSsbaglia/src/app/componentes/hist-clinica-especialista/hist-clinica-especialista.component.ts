import { Component, OnInit } from '@angular/core';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';
import { HistoriaClinica } from '../../clases/historia-clinica';
import { AuthService } from '../../services/auth.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Turno } from '../../clases/turno';
import { FormsModule } from '@angular/forms';
import { FiltrarDatosPipe } from '../../pipes/filtrar-datos.pipe';

@Component({
  selector: 'app-hist-clinica-especialista',
  standalone: true,
  imports: [DatePipe,NgFor,NgIf,FormsModule, FiltrarDatosPipe],
  templateUrl: './hist-clinica-especialista.component.html',
  styleUrl: './hist-clinica-especialista.component.css'
})
export class HistClinicaEspecialistaComponent implements OnInit {
  historiasClinicas: HistoriaClinica[] = [];
  especialistaId: string = '';
  turnosFiltrados: Turno[] = [];
  filtroGeneral: string = '';
  turnos: Turno[] = [];
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

  aplicarFiltro(): void {
    this.turnosFiltrados = this.turnos.filter(turno =>
      this.buscarEnTurno(turno, this.filtroGeneral)
    );
  }

  buscarEnTurno(turno: Turno, filtro: string): boolean {
    if (!filtro) return true;
    filtro = filtro.toLowerCase();

    // Buscar en los campos del turno
    if (
      turno.especialidad.toLowerCase().includes(filtro) ||
      turno.pacienteNombre.toLowerCase().includes(filtro) ||
      turno.estado.toLowerCase().includes(filtro) ||
      turno.fechaHora.toString().toLowerCase().includes(filtro)
    ) {
      return true;
    }

    // Buscar en la historia clínica asociada
    if (turno.historiaClinica) {
      const { altura, peso, temperatura, presion, datosDinamicos } = turno.historiaClinica;
      if (
        altura.toString().includes(filtro) ||
        peso.toString().includes(filtro) ||
        temperatura.toString().includes(filtro) ||
        presion.toLowerCase().includes(filtro) ||
        datosDinamicos.some(d => d.clave.toLowerCase().includes(filtro) || d.valor.toLowerCase().includes(filtro))
      ) {
        return true;
      }
    }

    return false;
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