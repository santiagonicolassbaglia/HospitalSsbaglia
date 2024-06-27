import { Component, OnInit } from '@angular/core';
import { Turno } from '../../clases/turno';
import { Usuario } from '../../clases/usuario';
import { TurnoService } from '../../services/turno.service';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe, DatePipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Disponibilidad } from '../../Interfaces/especialista';
import { EspecialistaService } from '../../services/especialista.service';


@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule,AsyncPipe,ReactiveFormsModule, JsonPipe,DatePipe ],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css'
})
export class SolicitarTurnoComponent implements OnInit {
  especialidades: string[] = [];
  especialistas: Usuario[] = [];
  turnosDisponibles: Date[] = [];
  especialidadSeleccionada: string | null = null;
  especialistaSeleccionado: Usuario | null = null;
  turnoSeleccionado: Date | null = null;
  dniUsuario: string = '';
  mensajeConfirmacion: boolean = false;

  constructor(
    private authService: AuthService,
    private turnoService: TurnoService,
    private especialistaService: EspecialistaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarEspecialidades();
  }

  private cargarEspecialidades(): void {
    this.authService.obtenerEspecialidades().subscribe(especialidades => {
      this.especialidades = especialidades;
    });
  }

  public seleccionarEspecialidad(especialidad: string): void {
    this.especialidadSeleccionada = especialidad;
    this.cargarEspecialistasPorEspecialidad(especialidad);
    this.mensajeConfirmacion = false;
  }

  private cargarEspecialistasPorEspecialidad(especialidad: string): void {
    this.authService.getUsuariosByEspecialidad(especialidad).subscribe(especialistas => {
      this.especialistas = especialistas;
    });
  }

  public seleccionarEspecialista(especialista: Usuario): void {
    this.especialistaSeleccionado = especialista;
    this.cargarTurnosDisponibles(especialista);
    this.mensajeConfirmacion = false;
  }

  private cargarTurnosDisponibles(especialista: Usuario): void {
    this.especialistaService.getDisponibilidad(especialista.uid).subscribe(disponibilidad => {
      this.turnosDisponibles = this.generarTurnosDisponibles(disponibilidad);
    });
  }

  private generarTurnosDisponibles(disponibilidad: Disponibilidad[]): Date[] {
    const turnos: Date[] = [];
    const now = new Date();

    disponibilidad.forEach(d => {
      d.horarios.forEach(h => {
        const [inicioHora, inicioMinuto] = h.inicio.split(':').map(Number);
        const [finHora, finMinuto] = h.fin.split(':').map(Number);

        const diaInicio = new Date(now.getFullYear(), now.getMonth(), now.getDate(), inicioHora, inicioMinuto);
        const diaFin = new Date(now.getFullYear(), now.getMonth(), now.getDate(), finHora, finMinuto);

        while (diaInicio < diaFin) {
          turnos.push(new Date(diaInicio));
          diaInicio.setMinutes(diaInicio.getMinutes() + 30); // Incrementar por 30 minutos
        }
      });
    });

    return turnos;
  }

  public seleccionarTurno(turno: Date): void {
    this.turnoSeleccionado = turno;
    this.mensajeConfirmacion = false;
  }

  public async confirmarTurno(): Promise<void> {
    try {
      const currentUser = await this.authService.usuarioActual();
      const nuevoTurno = new Turno(
        '',
        currentUser.uid,
        `${currentUser.nombre} ${currentUser.apellido}`,
        this.especialidadSeleccionada!,
        this.especialistaSeleccionado!.uid,
        `${this.especialistaSeleccionado!.nombre} ${this.especialistaSeleccionado!.apellido}`,
        this.turnoSeleccionado!,
        'pendiente',
        '',
        currentUser.dni || '',
        false,
        false
      );
  
      // Eliminar la propiedad historiaClinica si es undefined
      if (nuevoTurno.historiaClinica === undefined) {
        delete nuevoTurno.historiaClinica;
      }
  
      await this.turnoService.crearTurno(nuevoTurno);
      console.log('Turno creado con éxito');
      this.mensajeConfirmacion = true;
      setTimeout(() => {
        this.router.navigate(['/home']); // Redirige después de 2 segundos (2000 milisegundos)
      }, 2000);
    } catch (error) {
      console.error('Error al crear el turno:', error);
    }
  }
  getEspecialidadImagen(especialidad: string): string {
    // Lógica para obtener la imagen según la especialidad
    switch (especialidad) {
      case 'Cardiología':
        return 'assets/imagenes/especialidades/cardiologo.png';
      case 'Dermatología':
        return 'assets/imagenes/especialidades/dermatologo.jpg';
      case 'Neurología':
        return 'assets/imagenes/especialidades/neurologo.png';
      case 'Pediatría':
        return 'assets/imagenes/especialidades/pediatra.png';
      default:
        return 'assets/imagenes/especialidades/default.png';
    }
  }

  
}