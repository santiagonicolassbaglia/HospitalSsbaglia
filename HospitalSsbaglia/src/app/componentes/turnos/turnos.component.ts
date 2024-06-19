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
  pacienteId: string = '';
  especialistas: { [key: string]: Usuario } = {};

  turnoSeleccionado: Turno;
  comentarioCancelacion: string = '';

  constructor(
    private turnoService: TurnoService,
    private authService: AuthService
  ) {
    this.comentarioCancelacion = '';
  }

  ngOnInit(): void {
    this.obtenerPacienteId();
  }

  
  obtenerPacienteId(): void {
    this.authService.usuarioActual().then((usuario: Usuario) => {
      console.log('Usuario obtenido:', usuario);  // Log del usuario
      this.pacienteId = usuario.uid;
      this.obtenerTurnos();
    }).catch(error => {
      console.error('Error al obtener el usuario actual:', error);
    });
  }

 
  obtenerTurnos(): void {
    this.turnoService.getTurnosByPaciente(this.pacienteId).subscribe(turnos => {
      console.log('Turnos obtenidos:', turnos);  // Log de los turnos
      this.turnos = turnos;
      this.obtenerNombresEspecialistas(turnos);
    }, error => {
      console.error('Error al obtener los turnos:', error);
    });
  }
  

  obtenerNombresEspecialistas(turnos: Turno[]): void {
    const especialistaIds = [...new Set(turnos.map(turno => turno.especialista))];
    especialistaIds.forEach(id => {
      this.authService.getUserById(id).subscribe(usuario => {
        this.especialistas[id] = usuario;
        if (Object.keys(this.especialistas).length === especialistaIds.length) {
          this.filtrarTurnos();
        }
      }, error => {
        console.error('Error al obtener el especialista:', error);
      });
    });
  }

  filtrarTurnos(): void {
    this.turnosFiltrados = this.turnos.filter(turno =>
      turno.especialidad.toLowerCase().includes(this.filtroEspecialidad.toLowerCase()) &&
      (`${this.especialistas[turno.especialista]?.nombre?.toLowerCase()} ${this.especialistas[turno.especialista]?.apellido?.toLowerCase()}`).includes(this.filtroEspecialista.toLowerCase())
    );
  }

   

  cancelarTurno(turno: Turno): void {
    console.log('Intentando eliminar el turno con especialista:', turno.especialista, 'y fecha:', turno.fecha);
    this.turnoService.eliminarTurnoPorEspecialistaYFecha(turno.especialista, turno.fecha).then(() => {
      // Eliminamos el turno localmente
      this.turnos = this.turnos.filter(t => t.especialista !== turno.especialista || t.fecha !== turno.fecha);
      console.log('Turno eliminado exitosamente');
      this.filtrarTurnos();
    }).catch(error => {
      console.error('Error al eliminar el turno:', error);
      alert(`Error al eliminar el turno: ${error.message}`);
    });
  }

  puedeCancelar(turno: Turno): boolean {
    return turno.estado !== 'realizado' && turno.estado !== 'cancelado';
  }
 
  completarEncuesta(turno: Turno): void {
    const encuesta = prompt('Por favor, complete la encuesta:');
    if (encuesta) {
      this.turnoService.completarEncuesta(turno.id, encuesta).then(() => {
        turno.encuestaCompletada = true;
        console.log('Encuesta completada exitosamente');
        this.filtrarTurnos();
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
        this.filtrarTurnos();
      }).catch(error => {
        console.error('Error al calificar atención:', error);
      });
    }
  }

  puedeCalificarAtencion(turno: Turno): boolean {
    return turno.estado === 'realizado' && !turno.calificacionCompletada;
  }

  verResenia(turno: Turno): void {
    alert(`Reseña: ${turno.resenia}`);
  }
}