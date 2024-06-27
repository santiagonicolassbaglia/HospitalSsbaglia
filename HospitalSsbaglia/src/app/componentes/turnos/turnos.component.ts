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
  filtroGeneral: string = '';

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
      this.buscarEnTurno(turno, this.filtroGeneral)
    );
  }

  buscarEnTurno(turno: Turno, filtro: string): boolean {
    if (!filtro) return true;
    filtro = filtro.toLowerCase();

    // Buscar en los campos del turno
    if (
      turno.especialidad.toLowerCase().includes(filtro) ||
      turno.especialistaNombre.toLowerCase().includes(filtro) ||
      turno.estado.toLowerCase().includes(filtro) ||
      turno.fechaHora.toString().toLowerCase().includes(filtro)
    ) {
      return true;
    }

    // Buscar en la historia clínica asociada
    if (turno.historiaClinica) {
      const { altura, peso, temperatura, presion, datosDinamicos } = turno.historiaClinica;
      if (
        altura.toString().includes(filtro) ||
        peso.toString().includes(filtro) ||
        temperatura.toString().includes(filtro) ||
        presion.toLowerCase().includes(filtro) ||
        datosDinamicos.some(d => d.clave.toLowerCase().includes(filtro) || d.valor.toLowerCase().includes(filtro))
      ) {
        return true;
      }
    }

    return false;
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

  calificarAtencion(turno: Turno, calificacion: number): void {
    if (turno.estado === 'realizado') {
      turno.calificacion = calificacion;
      // Guardar la calificación en la base de datos
      this.turnoService.actualizarTurno(turno);
    }
  }

  toggleCancelarTurno(turno: any): void {
    if (turno.mostrarcomentario) {
      // Si estaba mostrando el comentario, guarda el texto antes de ocultarlo
      turno.comentarioGuardado = turno.comentario;
    }
    turno.mostrarcomentario = !turno.mostrarcomentario;
  }

  eliminarTurno(turnoId: string): void {
    this.turnoService.eliminarTurno(turnoId).then(() => {
      this.turnos = this.turnos.filter(turno => turno.id !== turnoId);
      this.turnosFiltrados = this.turnosFiltrados.filter(turno => turno.id !== turnoId);
    });
  }
}
