import { Component, OnInit } from '@angular/core';
import { Turno } from '../../clases/turno';
import { TurnoService } from '../../services/turno.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLinkActive } from '@angular/router';
import { Usuario } from '../../clases/usuario';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-turnos-especialista',
  standalone: true,
  imports: [NgIf,NgFor,FormsModule,RouterLinkActive,DatePipe],
  templateUrl: './turnos-especialista.component.html',
  styleUrl: './turnos-especialista.component.css'
})
export class TurnosEspecialistaComponent   {
  turnos: Turno[] = [];
  turnosFiltrados: Turno[] = [];
  especialidades: string[] = [];
  pacientes: { id: string, nombre: string }[] = [];
  filtroEspecialidad: string = '';
  filtroPaciente: string = '';

  constructor(private authService: AuthService, private turnoService: TurnoService) {}

  async ngOnInit(): Promise<void> {
    const currentUser = await this.authService.usuarioActual();
    this.turnoService.getTurnosByEspecialista(currentUser.uid).subscribe(turnos => {
      this.turnos = turnos;
      this.turnosFiltrados = turnos;
      this.obtenerEspecialidadesYPacientes(turnos);
    });
  }

  private obtenerEspecialidadesYPacientes(turnos: Turno[]): void {
    const especialidadesSet = new Set<string>();
    const pacientesSet = new Set<{ id: string, nombre: string }>();

    turnos.forEach(turno => {
      especialidadesSet.add(turno.especialidad);
      pacientesSet.add({ id: turno.pacienteId, nombre: turno.pacienteNombre });
    });

    this.especialidades = Array.from(especialidadesSet);
    this.pacientes = Array.from(pacientesSet);
  }

  aplicarFiltro(): void {
    this.turnosFiltrados = this.turnos.filter(turno => 
      (this.filtroEspecialidad === '' || turno.especialidad === this.filtroEspecialidad) &&
      (this.filtroPaciente === '' || turno.pacienteId === this.filtroPaciente)
    );
  }

  async cancelarTurno(turno: Turno, comentario: string): Promise<void> {
    if (turno.estado !== 'realizado' && turno.estado !== 'cancelado') {
      turno.estado = 'cancelado';
      turno.comentario = comentario;
      await this.turnoService.actualizarTurno(turno);
    }
  }

  async rechazarTurno(turno: Turno, comentario: string): Promise<void> {
    if (turno.estado === 'pendiente') {
      turno.estado = 'cancelado';
      turno.comentario = comentario;
      await this.turnoService.actualizarTurno(turno);
    }
  }

  async aceptarTurno(turno: Turno): Promise<void> {
    if (turno.estado === 'pendiente') {
      turno.estado = 'confirmado';
      await this.turnoService.actualizarTurno(turno);
    }
  }

  async finalizarTurno(turno: Turno, comentario: string): Promise<void> {
    if (turno.estado === 'confirmado') {
      turno.estado = 'realizado';
      turno.comentario = comentario;  
      await this.turnoService.actualizarTurno(turno);
    }
  }

  verResenia(turno: Turno): void {
    if (turno.estado === 'realizado' || turno.estado === 'cancelado') {
      turno.mostrarresenia = !turno.mostrarresenia; 
  
      if (turno.mostrarresenia && !turno.comentario) {
        this.turnoService.obtenerComentario(turno.id).subscribe(comentario => {
          turno.comentario = comentario ? comentario : 'No hay reseña';  
        });
      }
    }
  }
}