import { Component, OnInit } from '@angular/core';
import { Turno } from '../../clases/turno';
import { Usuario } from '../../clases/usuario';
import { TurnoService } from '../../services/turno.service';
import { AuthService } from '../../services/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css'
})
export class SolicitarTurnoComponent implements OnInit {
  especialidades: string[] = [];
  especialistas: Usuario[] = [];
  especialistasFiltrados: Usuario[] = [];
  selectedEspecialidad: string = '';
  selectedEspecialista: string = '';
  selectedFecha: Date = new Date();
  dniUsuario: string = '';

  constructor(
    private turnoService: TurnoService,
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.authService.getAll().subscribe(usuarios => {
      console.log('Usuarios obtenidos:', usuarios); // Depuración
      this.especialistas = usuarios.filter(usuario => usuario.especialidad.length > 0 && usuario.aprobado);
      console.log('Especialistas:', this.especialistas); // Depuración
      this.especialidades = [...new Set(this.especialistas.flatMap(esp => esp.especialidad))];
      console.log('Especialidades:', this.especialidades); // Depuración
    });
  }

  actualizarEspecialistas(): void {
    console.log('Especialidad seleccionada:', this.selectedEspecialidad); // Depuración
    this.especialistasFiltrados = this.especialistas.filter(especialista => 
      especialista.especialidad.includes(this.selectedEspecialidad)
    );
    console.log('Especialistas Filtrados:', this.especialistasFiltrados); // Depuración
  }

  solicitarTurno(): void {
    this.authService.getCurrentUser().subscribe(currentUser => {
      if (currentUser) {
        const turno: Turno = {
          id: this.firestore.createId(),
          especialidad: this.selectedEspecialidad,
          especialista: this.selectedEspecialista,
          fecha: this.selectedFecha,
          estado: 'solicitado',
          paciente: currentUser.uid,
          dniUsuario: this.dniUsuario
        };

        this.turnoService.crearTurno(turno).then(() => {
          alert('Turno solicitado con éxito');
        });
      }
    });
  }
}