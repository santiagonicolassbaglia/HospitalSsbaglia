import { Component, OnInit } from '@angular/core';
import { Turno } from '../../clases/turno';
import { TurnoService } from '../../services/turno.service';
import { AsyncPipe, DatePipe, NgFor, NgIf, NgSwitchCase } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../clases/usuario';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterLink, RouterLinkActive, AsyncPipe, DatePipe, NgSwitchCase, AsyncPipe],
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {

  turnos: Turno[] = [];
  turnosFiltrados: Turno[] = [];
  especialidades: string[] = [];
  especialistas: { id: string, nombre: string }[] = [];
  filtroEspecialidad: string = '';
  filtroEspecialista: string = '';

  constructor(private authService: AuthService, private turnoService: TurnoService) {}

  async ngOnInit(): Promise<void> {
    const currentUser = await this.authService.usuarioActual();
    this.turnoService.getTurnosByPaciente(currentUser.uid).subscribe(turnos => {
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

  async cancelarTurno(turno: Turno): Promise<void> {
    if (turno.estado !== 'realizado') {
      turno.estado = 'cancelado';
      turno.comentario = turno.comentario ? turno.comentario : 'Turno cancelado por el paciente';
      await this.turnoService.actualizarTurno(turno);
    }
  }

  completarEncuesta(turno: Turno): void {
    if (turno.estado === 'realizado') {
      this.turnoService.obtenerEncuesta(turno.id).subscribe(encuesta => {
        if (encuesta) {
          console.log('La encuesta ya fue completada');
        } else {
          console.log('Redirigir al formulario de encuesta');
        }
      });
    }
  }

  verResenia(turno: Turno): void {
    if (turno.estado === 'realizado') {
      turno.mostrarresenia = !turno.mostrarresenia;
      if (turno.mostrarresenia) {
        this.turnoService.obtenerReseña(turno.id).subscribe(reseña => {
          turno.comentario = reseña ? reseña : 'No hay reseña';
        });
      }
    }
  }

  calificarAtencion(turno: Turno, comentario: string): void {
    if (turno.estado === 'realizado') {
      turno.comentario = comentario;
      // Implementar la lógica para guardar la calificación
    }
  }
}
