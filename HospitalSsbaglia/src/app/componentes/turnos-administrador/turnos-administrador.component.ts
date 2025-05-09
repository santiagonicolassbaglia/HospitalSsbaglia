import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../../services/turno.service';
import { Turno } from '../../clases/turno';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FiltrarDatosPipe } from '../../pipes/filtrar-datos.pipe';

@Component({
  selector: 'app-turnos-administrador',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, FormsModule, FiltrarDatosPipe],
  templateUrl: './turnos-administrador.component.html',
  styleUrls: ['./turnos-administrador.component.css']
})
export class TurnosAdministradorComponent implements OnInit {
  turnos: Turno[] = [];
  turnosFiltrados: Turno[] = [];
  especialidades: string[] = [];
  especialistas: { id: string, nombre: string }[] = [];
  filtroEspecialidad: string = '';
  filtroEspecialista: string = '';
  filtroGeneral: string = '';

  constructor(private authService: AuthService, private turnoService: TurnoService) {}

  async ngOnInit(): Promise<void> {
    this.turnoService.getTurnos().subscribe(turnos => {
      this.turnos = turnos.map(turno => ({
        ...turno,
        fechaHora: this.convertTimestampToDate(turno.fechaHora)
      }));
      this.turnos.sort((a, b) => a.fechaHora.getTime() - b.fechaHora.getTime());
      this.turnosFiltrados = this.turnos;
      this.obtenerEspecialidadesYEspecialistas(this.turnos);
    });
  }

  private convertTimestampToDate(timestamp: any): Date {
    return timestamp instanceof Date ? timestamp : timestamp.toDate();
  }

  private obtenerEspecialidadesYEspecialistas(turnos: Turno[]): void {
    const especialidadesSet = new Set<string>();
    const especialistasSet = new Set<{ id: string, nombre: string }>();

    turnos.forEach(turno => {
      especialidadesSet.add(turno.especialidad);
      especialistasSet.add({ id: turno.especialistaId, nombre: turno.especialistaNombre });
    });

    this.especialidades = Array.from(especialidadesSet);
    this.especialistas = Array.from(especialistasSet);
  }

  aplicarFiltro(): void {
    this.turnosFiltrados = this.turnos.filter(turno => 
      (this.filtroEspecialidad === '' || turno.especialidad === this.filtroEspecialidad) &&
      (this.filtroEspecialista === '' || turno.especialistaId === this.filtroEspecialista)
    );
  }

  async cancelarTurno(turno: Turno, comentario: string): Promise<void> {
    if (turno.estado !== 'confirmado' && turno.estado !== 'realizado' && turno.estado !== 'cancelado') {
      turno.estado = 'cancelado';
      turno.comentario = comentario;
      await this.turnoService.actualizarTurno(turno);
    }
  }
}
