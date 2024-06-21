
import { Component, OnInit, Pipe } from '@angular/core';
import { Turno } from '../../clases/turno';
import { TurnoService } from '../../services/turno.service';
import { AsyncPipe, DatePipe, NgFor, NgIf, NgSwitchCase } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable, pipe } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../clases/usuario';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [NgFor,NgIf,FormsModule,RouterLink,RouterLinkActive,AsyncPipe, DatePipe,NgSwitchCase, AsyncPipe],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css'
})
export class TurnosComponent   {

  turnos$: Observable<Turno[]>;
  especialidades: string[];
  especialistas: Usuario[];
  filtroEspecialidad: string = '';
  filtroEspecialista: string = '';
  puedeCancelarTurno: boolean = false;
  especialistas$: Observable<Usuario[]>;


  constructor(private turnoService: TurnoService, private authService: AuthService) {
    this.turnos$ = new Observable<Turno[]>();
    this.especialidades = [];
    this.especialistas = [];
    this.especialistas$ = new Observable<Usuario[]>();
  }

  ngOnInit(): void {

    this.especialistas$ = this.turnoService.obtenerEspecialistas();
    this.authService.getCurrentUserDni().then(dniUsuario => {
      if (dniUsuario) {
        this.turnos$ = this.turnoService.getTurnosByDniUsuario(dniUsuario);
        console.log("dni:", dniUsuario);
      } else {
        console.error('No se encontró el dni del usuario');
      }
    }).catch(error => {
      console.error('Error al obtener el dni del usuario:', error);
    });

    this.turnoService.obtenerEspecialidades().subscribe(
      especialidades => {
        this.especialidades = especialidades;
      },
      error => {
        console.error('Error al obtener las especialidades:', error);
      }
    );

    this.turnoService.obtenerEspecialistas().subscribe(
      especialistas => {
        this.especialistas = especialistas;
      },
      error => {
        console.error('Error al obtener los especialistas:', error);
      }
    );
  }


 
  cancelarTurno(turno: Turno)  {
    if (this.puedeCancelarTurno) {
   

      this.turnoService.deleteTurno(turno.id).then(() => {
        console.log('Turno cancelado correctamente');
      }).catch(error => {
        console.error('Error al cancelar el turno:', error);
      });
    } else { 
      console.error('No se puede cancelar el turno');
    }
  }
  verResena(turno: Turno)  {
    
    console.log('Reseña:', turno.resenia);

    
  }

  completarEncuesta(turno: Turno): void {
    // Implementa la lógica para completar la encuesta
  }

  calificarAtencion(turno: Turno): void {
    // Implementa la lógica para calificar la atención del especialista
  }

  aplicarFiltros(): void {
    // Implementa la lógica para aplicar los filtros de especialidad y especialista
    // this.turnos$ = this.turnoService.filtrarTurnos(this.filtroEspecialidad, this.filtroEspecialista);
  }
}