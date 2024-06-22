import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../../services/turno.service';
import { Turno } from '../../clases/turno';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-turnos-administrador',
  standalone: true,
  imports: [NgFor,NgIf,DatePipe,FormsModule],
  templateUrl: './turnos-administrador.component.html',
  styleUrl: './turnos-administrador.component.css'
})
export class TurnosAdministradorComponent   {
  turnos: Turno[] = [];
  turnosFiltrados: Turno[] = [];
  especialidades: string[] = [];
  especialistas: { id: string, nombre: string }[] = [];
  filtroEspecialidad: string = '';
  filtroEspecialista: string = '';

  constructor(private authService: AuthService, private turnoService: TurnoService) {}

  async ngOnInit(): Promise<void> {
    this.turnoService.getTurnos().subscribe(turnos => {
      this.turnos = turnos;
      this.turnosFiltrados = turnos;
      this.obtenerEspecialidadesYEspecialistas(turnos);
    });
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