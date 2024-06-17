import { Component, OnInit } from '@angular/core';
import { Turno } from '../../clases/turno';
import { TurnoService } from '../../services/turno.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLinkActive } from '@angular/router';
import { Usuario } from '../../clases/usuario';
import { AuthService } from '../../services/auth.service';

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
  especialistaId: string = ''; // Variable para almacenar el ID del especialista

  turnoSeleccionado: Turno;
  comentarioResenia: string = '';

  constructor(
    private turnoService: TurnoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.obtenerEspecialistaId();
  }

  obtenerEspecialistaId(): void {
    this.authService.usuarioActual().then((usuario: Usuario) => {
      this.especialistaId = usuario.uid; // Asignar el ID del especialista
      this.obtenerTurnos();
    }).catch(error => {
      console.error('Error al obtener el usuario actual:', error);
      // Manejar el error apropiadamente
    });
  }

  obtenerTurnos(): void {
    // Llamar al servicio de turnos usando el ID del especialista
    this.turnoService.getTurnosByEspecialista(this.especialistaId).subscribe(turnos => {
      this.turnos = turnos;
      this.filtrarTurnos();
    }, error => {
      console.error('Error al obtener los turnos del especialista:', error);
      // Manejar el error apropiadamente
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
      }).catch(error => {
        console.error('Error al cancelar el turno:', error);
      });
    }
  }

  rechazarTurno(turno: Turno): void {
    const comentario = prompt('¿Por qué desea rechazar el turno?');
    if (comentario) {
      this.turnoService.rechazarTurno(turno.id, comentario).then(() => {
        turno.estado = 'rechazado';
        this.filtrarTurnos();
      }).catch(error => {
        console.error('Error al rechazar el turno:', error);
      });
    }
  }

  aceptarTurno(turno: Turno): void {
    this.turnoService.aceptarTurno(turno.id).then(() => {
      turno.estado = 'aceptado';
      this.filtrarTurnos();
    }).catch(error => {
      console.error('Error al aceptar el turno:', error);
    });
  }

  finalizarTurno(turno: Turno): void {
    this.turnoSeleccionado = turno;
    this.comentarioResenia = ''; // Limpiar comentario de reseña
    document.getElementById('modalResenia').style.display = 'block';
  }

  confirmarFinalizarTurno(): void {
    if (this.comentarioResenia) {
      this.turnoService.finalizarTurno(this.turnoSeleccionado.id, this.comentarioResenia).then(() => {
        this.turnoSeleccionado.estado = 'realizado';
        this.turnoSeleccionado.resenia = this.comentarioResenia;
        this.filtrarTurnos();
        this.cerrarModalResenia();
      }).catch(error => {
        console.error('Error al finalizar el turno:', error);
      });
    }
  }

  cancelarFinalizarTurno(): void {
    this.cerrarModalResenia();
  }

  cerrarModalResenia(): void {
    document.getElementById('modalResenia').style.display = 'none';
  }

  verResenia(turno: Turno): void {
    alert(`Reseña: ${turno.resenia}`);
  }
}