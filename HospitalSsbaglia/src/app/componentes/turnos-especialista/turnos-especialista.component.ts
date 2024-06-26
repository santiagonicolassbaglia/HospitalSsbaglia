import { Component, OnInit } from '@angular/core';
import { Turno } from '../../clases/turno';
import { TurnoService } from '../../services/turno.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLinkActive } from '@angular/router';
import { Usuario } from '../../clases/usuario';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';
import { HistoriaClinica } from '../../clases/historia-clinica';

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
  especialidades: string[] = [];
  pacientes: { id: string, nombre: string }[] = [];
  filtroEspecialidad: string = '';
  filtroPaciente: string = '';
  mostrarFormulario: boolean = false;
  turnoSeleccionado: Turno | null = null;
  datosClinicos: any = {
    altura: '',
    peso: '',
    temperatura: '',
    presion: '',
    dinamicos: [{ clave: '', valor: '' }]
  };

  constructor(
    private authService: AuthService,
    private turnoService: TurnoService,
    private historiaClinicaService: HistoriaClinicaService
  ) {}

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

  mostrarFormularioHistoriaClinica(turno: Turno): void {
    this.turnoSeleccionado = turno;
    this.mostrarFormulario = true;
  }

  agregarDatoDinamico(): void {
    if (this.datosClinicos.dinamicos.length < 3) {
      this.datosClinicos.dinamicos.push({ clave: '', valor: '' });
    }
  }

  eliminarDatoDinamico(index: number): void {
    if (this.datosClinicos.dinamicos.length > 1) {
      this.datosClinicos.dinamicos.splice(index, 1);
    }
  }

  async finalizarTurno(): Promise<void> {
    if (this.turnoSeleccionado) {
      this.turnoSeleccionado.estado = 'realizado';
      await this.turnoService.actualizarTurno(this.turnoSeleccionado);

      const historiaClinica: HistoriaClinica = {
        id: '',
        pacienteId: this.turnoSeleccionado.pacienteId,
        especialistaId: this.turnoSeleccionado.especialistaId,
        fecha: new Date(),
        altura: this.datosClinicos.altura,
        peso: this.datosClinicos.peso,
        temperatura: this.datosClinicos.temperatura,
        presion: this.datosClinicos.presion,
        nombrePaciente: this.turnoSeleccionado.pacienteNombre,
        nombreEspecialista: this.turnoSeleccionado.especialistaNombre,
        datosDinamicos: this.datosClinicos.dinamicos
      };

      await this.historiaClinicaService.agregarHistoriaClinica(historiaClinica);

      this.mostrarFormulario = false;
      this.turnoSeleccionado = null;
      this.datosClinicos = { altura: '', peso: '', temperatura: '', presion: '', dinamicos: [{ clave: '', valor: '' }] };
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