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
export class TurnosEspecialistaComponent implements OnInit {
  turnos: Turno[] = [];
  turnosFiltrados: Turno[] = [];
  filtroEspecialidad: string = '';
  filtroEspecialista: string = '';
  pacienteId: string = '';
  especialistas: { [key: string]: Usuario } = {}; // Mapa de especialistas por ID

  turnoSeleccionado: Turno; // Variable para almacenar el turno seleccionado para cancelar
  comentarioCancelacion: string = ''; // Variable para almacenar el comentario de cancelación

  constructor(
    private turnoService: TurnoService,
    private authService: AuthService
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
      this.obtenerNombresEspecialistas(turnos); // Obtener los nombres de los especialistas
    });
  }

  obtenerNombresEspecialistas(turnos: Turno[]): void {
    const especialistaIds = [...new Set(turnos.map(turno => turno.especialista))];
    especialistaIds.forEach(id => {
      this.authService.getUserById(id).subscribe((usuario: Usuario) => {
        this.especialistas[id] = usuario;
        if (Object.keys(this.especialistas).length === especialistaIds.length) {
          this.filtrarTurnos(); // Filtrar los turnos después de obtener todos los especialistas
        }
      }, error => {
        console.error('Error al obtener el especialista:', error);
      });
    });
  }

  filtrarTurnos(): void {
    this.turnosFiltrados = this.turnos.filter(turno =>
      turno.especialidad.toLowerCase().includes(this.filtroEspecialidad.toLowerCase()) &&
      (`${this.especialistas[turno.especialista]?.nombre.toLowerCase()} ${this.especialistas[turno.especialista]?.apellido.toLowerCase()}`).includes(this.filtroEspecialista.toLowerCase())
    );
  }

  puedeCancelar(turno: Turno): boolean {
    return turno.estado !== 'realizado';
  }

  mostrarModalCancelar(turno: Turno): void {
    this.turnoSeleccionado = turno;
    this.comentarioCancelacion = '';
    document.getElementById('modalCancelar').style.display = 'block';
  }

  cerrarModalCancelar(): void {
    document.getElementById('modalCancelar').style.display = 'none';
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

  verResenia(turno: Turno): void {
    alert(`Reseña: ${turno.resenia}`);
  }
}