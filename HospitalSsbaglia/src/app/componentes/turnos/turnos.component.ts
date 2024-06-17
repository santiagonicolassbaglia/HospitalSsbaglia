import { Component, OnInit, Pipe } from '@angular/core';
import { Turno } from '../../clases/turno';
import { TurnoService } from '../../services/turno.service';
import { AsyncPipe, DatePipe, NgFor, NgIf, NgSwitchCase } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { pipe } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../clases/usuario';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [NgFor,NgIf,FormsModule,RouterLink,RouterLinkActive,AsyncPipe, DatePipe,NgSwitchCase],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css'
})
export class TurnosComponent  implements OnInit {
  turnos: Turno[] = [];
  turnosFiltrados: Turno[] = [];
  filtroEspecialidad: string = '';
  filtroEspecialista: string = '';
  pacienteId: string = ''; // Variable para almacenar el ID del paciente

  constructor(
    private turnoService: TurnoService,
    private authService: AuthService // Inyecta el AuthService
  ) {}

  ngOnInit(): void {
    this.obtenerPacienteId();
  }

  obtenerPacienteId(): void {
    this.authService.usuarioActual().then((usuario: Usuario) => {
      this.pacienteId = usuario.uid;
      this.obtenerTurnos();
    }).catch(error => {
      console.error('Error al obtener el usuario actual:', error);
      // Manejar el error apropiadamente
    });
  }

  obtenerTurnos(): void {
    this.turnoService.getTurnosByPaciente(this.pacienteId).subscribe(turnos => {
      this.turnos = turnos;
      this.filtrarTurnos();
    });
  }

  filtrarTurnos(): void {
    this.turnosFiltrados = this.turnos.filter(turno =>
      turno.especialidad.toLowerCase().includes(this.filtroEspecialidad.toLowerCase()) &&
      turno.especialista.toLowerCase().includes(this.filtroEspecialista.toLowerCase())
    );
  }


  puedeCancelar(turno: Turno): boolean {
    return turno.estado !== 'realizado';
  }

  completarEncuesta(turno: Turno): void {
    const encuesta = prompt('Por favor, complete la encuesta:');
    if (encuesta) {
      this.turnoService.completarEncuesta(turno.id, encuesta).then(() => {
        turno.encuestaCompletada = true;
        console.log('Encuesta completada exitosamente');
        this.filtrarTurnos(); // Actualizar la lista después de completar la encuesta
      }).catch(error => {
        console.error('Error al completar encuesta:', error);
      });
    }
  }

  puedeCompletarEncuesta(turno: Turno): boolean {
    return turno.estado === 'realizado' && !turno.encuestaCompletada;
  }

  calificarAtencion(turno: Turno): void {
    const calificacion = prompt('Califique la atención del especialista:');
    if (calificacion) {
      this.turnoService.calificarAtencion(turno.id, calificacion).then(() => {
        turno.calificacionCompletada = true;
        console.log('Calificación completada exitosamente');
        this.filtrarTurnos(); // Actualizar la lista después de calificar la atención
      }).catch(error => {
        console.error('Error al calificar atención:', error);
      });
    }
  }

  puedeCalificarAtencion(turno: Turno): boolean {
    return turno.estado === 'realizado' && !turno.calificacionCompletada;
  }

  cancelarTurno(turno: Turno): void {
    const comentario = prompt('¿Por qué desea cancelar el turno?');
    if (comentario) {
      this.turnoService.cancelarTurno(turno.id, comentario).then(() => {
        console.log('Turno cancelado exitosamente');
        this.obtenerTurnos(); // Actualizar la lista después de cancelar uno
      }).catch(error => {
        console.error('Error al cancelar turno:', error);
      });
    }
  }

  verResenia(turno: Turno): void {
    alert(`Reseña: ${turno.resenia}`);
  }
}