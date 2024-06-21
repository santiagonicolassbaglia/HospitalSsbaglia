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
    private router: Router // Inyecta Router en el constructor
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
    this.mensajeConfirmacion = false; // Reset mensaje de confirmación
  }

  private cargarEspecialistasPorEspecialidad(especialidad: string): void {
    this.authService.getUsuariosByEspecialidad(especialidad).subscribe(especialistas => {
      this.especialistas = especialistas;
    });
  }

  public seleccionarEspecialista(especialista: Usuario): void {
    this.especialistaSeleccionado = especialista;
    this.cargarTurnosDisponibles(especialista);
    this.mensajeConfirmacion = false; // Reset mensaje de confirmación
  }

  private cargarTurnosDisponibles(especialista: Usuario): void {
    // Implementación de la lógica para cargar los turnos disponibles
    this.turnosDisponibles = this.generarTurnosDisponibles();
  }

  private generarTurnosDisponibles(): Date[] {
    // Generación de turnos de ejemplo
    const turnos: Date[] = [];
    const now = new Date();
    for (let i = 1; i <= 15; i++) {
      const fecha = new Date();
      fecha.setDate(now.getDate() + i);
      fecha.setHours(9, 0, 0); // Ejemplo de horario: 9:00 AM
      turnos.push(new Date(fecha));
      fecha.setHours(13, 0, 0); // Ejemplo de horario: 1:00 PM
      turnos.push(new Date(fecha));
    }
    return turnos;
  }

  public seleccionarTurno(turno: Date): void {
    this.turnoSeleccionado = turno;
    this.mensajeConfirmacion = false; // Reset mensaje de confirmación
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
      await this.turnoService.crearTurno(nuevoTurno);
      console.log('Turno creado con éxito');
      this.mensajeConfirmacion = true; 
      setTimeout(() => {
        this.router.navigate(['/home']); // Ajusta la ruta según corresponda
      }, 2000); // Redirige después de 2 segundos (2000 milisegundos)
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