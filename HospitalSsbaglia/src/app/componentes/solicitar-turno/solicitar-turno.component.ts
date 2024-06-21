import { Component, OnInit } from '@angular/core';
import { Turno } from '../../clases/turno';
import { Usuario } from '../../clases/usuario';
import { TurnoService } from '../../services/turno.service';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule,AsyncPipe,ReactiveFormsModule, JsonPipe ],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css'
})
export class SolicitarTurnoComponent implements OnInit {
  especialidades: string[] = [];
  especialistas: Usuario[] = [];
  mensaje: string = '';
  mensajeError: string = '';
  usuarioActual: Usuario | null = null;
  turnoForm: FormGroup;
  especialistaSeleccionado: Usuario | null = null;
 
  especialistas$: Observable<Usuario[]>;
 
 
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private turnoService: TurnoService
  ) {
    this.turnoForm = this.fb.group({
      especialidad: ['', Validators.required],
      especialista: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.obtenerEspecialidades().subscribe(
      especialidades => {
        this.especialidades = especialidades;
      },
      error => {
        console.error('Error al obtener las especialidades:', error);
      }
    );
  }

  buscarEspecialistas(): void {
    const especialidadSeleccionada = this.turnoForm.get('especialidad')?.value;
    if (especialidadSeleccionada) {
      this.especialistas$ = this.turnoService.obtenerEspecialistasPorEspecialidad(especialidadSeleccionada);
    } else {
      this.especialistas$ = null; // Limpiar la lista de especialistas si no hay especialidad seleccionada
    }
  }

  solicitarTurno(): void {
    if (this.turnoForm.valid) {
      const turno = this.turnoForm.value;
      this.turnoService.solicitarTurno(turno)
        .then(() => {
          this.mensaje = 'Turno solicitado correctamente';
          this.mensajeError = '';
          this.turnoForm.reset();
        })
        .catch(error => {
          console.error('Error al solicitar turno:', error);
          this.mensajeError = 'Ocurrió un error al solicitar el turno. Por favor, intenta nuevamente.';
          this.mensaje = '';
        });
    } else {
      this.mensajeError = 'Por favor completa todos los campos del formulario.';
      this.mensaje = '';
    }
  }

  obtenerFechasDisponibles(): void {
    const especialistaId = this.turnoForm.get('especialista')?.value?.id;
    if (especialistaId) {
      this.turnoService.obtenerFechasDisponibles(especialistaId).subscribe(
        fechas => {
          // Filtrar las fechas disponibles dentro de los próximos 15 días
          const proximos15Dias = new Date();
          proximos15Dias.setDate(proximos15Dias.getDate() + 15);

          const fechasDisponibles = fechas.filter(fecha => new Date(fecha) <= proximos15Dias);
          // Use the filtered dates as needed
 
        },
        error => {
          console.error('Error al obtener las fechas disponibles:', error);
        }
      );
    }
  }
}
 