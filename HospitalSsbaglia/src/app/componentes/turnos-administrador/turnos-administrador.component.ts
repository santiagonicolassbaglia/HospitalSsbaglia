import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../../services/turno.service';
import { Turno } from '../../clases/turno';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-turnos-administrador',
  standalone: true,
  imports: [NgFor,NgIf,DatePipe,FormsModule],
  templateUrl: './turnos-administrador.component.html',
  styleUrl: './turnos-administrador.component.css'
})
export class TurnosAdministradorComponent implements OnInit {
  turnos: Turno[] = [];
  turnosFiltrados: Turno[] = [];
  filtroEspecialidad: string = '';
  filtroEspecialista: string = '';

  constructor(private turnoService: TurnoService) {}

  ngOnInit(): void {
    this.turnoService.getTurnos().subscribe(turnos => {
      this.turnos = turnos;
      this.turnosFiltrados = turnos;
    });
  }

  filtrarTurnos(): void {
    this.turnosFiltrados = this.turnos.filter(turno =>
      turno.especialidad.toLowerCase().includes(this.filtroEspecialidad.toLowerCase()) &&
      turno.especialista.toLowerCase().includes(this.filtroEspecialista.toLowerCase())
    );
  }

  cancelarTurno(turno: Turno): void {
    const comentario = prompt('¿Por qué desea cancelar el turno?');
    if (comentario) {
      this.turnoService.cancelarTurno(turno.id, comentario).then(() => {
        turno.estado = 'cancelado';
      });
    }
  }

  puedeCancelar(turno: Turno): boolean {
    return turno.estado !== 'realizado';
  }
}