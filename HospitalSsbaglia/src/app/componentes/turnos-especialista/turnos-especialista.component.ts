import { Component, OnInit } from '@angular/core';
import { Turno } from '../../clases/turno';
import { TurnoService } from '../../services/turno.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-turnos-especialista',
  standalone: true,
  imports: [NgIf,NgFor,FormsModule,RouterLinkActive,DatePipe],
  templateUrl: './turnos-especialista.component.html',
  styleUrl: './turnos-especialista.component.css'
})
export class TurnosEspecialistaComponent implements OnInit {
  turnos: Turno[] = [];
  turnosFiltrados: Turno[] = [];
  filtroEspecialidad: string = '';
  filtroPaciente: string = '';

  constructor(private turnoService: TurnoService) {}

  ngOnInit(): void {
    this.turnoService.getTurnosByEspecialista('especialista-id').subscribe(turnos => {
      this.turnos = turnos;
      this.turnosFiltrados = turnos;
    });
  }

  filtrarTurnos(): void {
    this.turnosFiltrados = this.turnos.filter(turno =>
      turno.especialidad.toLowerCase().includes(this.filtroEspecialidad.toLowerCase()) &&
      turno.paciente.toLowerCase().includes(this.filtroPaciente.toLowerCase())
    );
  }

  puedeCancelar(turno: Turno): boolean {
    return turno.estado !== 'realizado' && turno.estado !== 'rechazado';
  }

  puedeRechazar(turno: Turno): boolean {
    return turno.estado !== 'aceptado' && turno.estado !== 'realizado' && turno.estado !== 'cancelado';
  }

  puedeAceptar(turno: Turno): boolean {
    return turno.estado === 'pendiente';
  }

  puedeFinalizar(turno: Turno): boolean {
    return turno.estado === 'aceptado';
  }

  cancelarTurno(turno: Turno): void {
    const comentario = prompt('¿Por qué desea cancelar el turno?');
    if (comentario) {
      this.turnoService.cancelarTurno(turno.id, comentario).then(() => {
        turno.estado = 'cancelado';
        this.filtrarTurnos();
      });
    }
  }

  rechazarTurno(turno: Turno): void {
    const comentario = prompt('¿Por qué desea rechazar el turno?');
    if (comentario) {
      this.turnoService.rechazarTurno(turno.id, comentario).then(() => {
        turno.estado = 'rechazado';
        this.filtrarTurnos();
      });
    }
  }

  aceptarTurno(turno: Turno): void {
    this.turnoService.aceptarTurno(turno.id).then(() => {
      turno.estado = 'aceptado';
      this.filtrarTurnos();
    });
  }

  finalizarTurno(turno: Turno): void {
    const comentario = prompt('Ingrese la reseña o comentario del turno:');
    if (comentario) {
      this.turnoService.finalizarTurno(turno.id ,comentario).then(() => {
        turno.estado = 'realizado';
        turno.resenia = comentario;
        this.filtrarTurnos();
      });
    }
  }

  verResenia(turno: Turno): void {
    alert(`Reseña: ${turno.resenia}`);
  }

  
}