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
import { OrdenarTurnosPipe } from '../../pipes/ordenar-turnos.pipe';

@Component({
  selector: 'app-turnos-especialista',
  standalone: true,
  imports: [NgIf,NgFor,FormsModule,RouterLinkActive,DatePipe, OrdenarTurnosPipe],
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
  filtroGeneral: string = '';
  mensajeExito: boolean = false;

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
      this.turnoService.cargarHistoriasClinicas(turnos).subscribe(turnosConHistorias => {
        this.turnos = turnosConHistorias.map(turno => {
          turno.fechaHora = this.convertTimestampToDate(turno.fechaHora);
          return turno;
        }).sort((a, b) => a.fechaHora.getTime() - b.fechaHora.getTime());
        this.turnosFiltrados = this.turnos;
        this.obtenerEspecialidadesYPacientes(this.turnos);
      });
    });
  }
  
 
  private convertTimestampToDate(timestamp: any): Date {
    return timestamp instanceof Date ? timestamp : timestamp.toDate();
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
      this.buscarEnTurno(turno, this.filtroGeneral)
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
  
      // Inicializar historiaClinica si es undefined
      if (!turno.historiaClinica) {
        turno.historiaClinica = {

          id: '',
          turnoId: turno.id,
          pacienteId: turno.pacienteId,
          especialistaId: turno.especialistaId,
          fecha: new Date(),
          altura: null,
          peso:null,
          temperatura: null,
          presion: '',
          nombrePaciente: turno.pacienteNombre,
          nombreEspecialista: turno.especialistaNombre,
          especialidad: turno.especialidad,
          datosDinamicos: [{ clave: '', valor: '' }]
        };
      }
  
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
      this.mensajeExito = true;
      this.turnoSeleccionado.estado = 'realizado';
      await this.turnoService.actualizarTurno(this.turnoSeleccionado);

      const historiaClinica: HistoriaClinica = {
        id: '',
        turnoId: this.turnoSeleccionado.id,
        pacienteId: this.turnoSeleccionado.pacienteId,
        especialistaId: this.turnoSeleccionado.especialistaId,
        fecha: new Date(),
        altura: this.datosClinicos.altura,
        peso: this.datosClinicos.peso,
        temperatura: this.datosClinicos.temperatura,
        presion: this.datosClinicos.presion,
        nombrePaciente: this.turnoSeleccionado.pacienteNombre,
        nombreEspecialista: this.turnoSeleccionado.especialistaNombre,
        especialidad: this.turnoSeleccionado.especialidad,
        datosDinamicos: this.datosClinicos.dinamicos,

      
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
 
  buscarEnTurno(turno: Turno, filtro: string): boolean {
    if (!filtro) return true;
    filtro = filtro.toLowerCase();

    // Buscar en los campos del turno
    if (
      turno.especialidad.toLowerCase().includes(filtro) ||
      turno.pacienteNombre.toLowerCase().includes(filtro) ||
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
}

 