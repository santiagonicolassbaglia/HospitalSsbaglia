import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../Interfaces/usuario';
import { EspecialistaService } from '../../services/especialista.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Disponibilidad, Especialista } from '../../Interfaces/especialista';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {
  usuario: Usuario | Especialista | undefined;
  esEspecialista = false;
  disponibilidadHoraria: Disponibilidad[] = [];
  imagenes: string[] = [];

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private especialistaService: EspecialistaService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.usuarioService.getUsuario(user.uid).subscribe(usuario => {
          this.usuario = usuario;
          if (usuario) {
            this.imagenes = this.obtenerURLsImagenes(usuario.imagenes);
          }
          if (usuario && (usuario as Especialista).especialidad.length > 0) {
            this.esEspecialista = true;
            this.cargarDisponibilidadHoraria(user.uid);
          }
        });
      }
    });
  }

  private cargarDisponibilidadHoraria(uid: string): void {
    this.especialistaService.getDisponibilidad(uid).subscribe(disponibilidad => {
      this.disponibilidadHoraria = disponibilidad.length ? disponibilidad : this.inicializarDisponibilidad();
    });
  }

  private inicializarDisponibilidad(): Disponibilidad[] {
    return [
      { dia: 'Lunes', horarios: [] },
      { dia: 'Martes', horarios: [] },
      { dia: 'Miércoles', horarios: [] },
      { dia: 'Jueves', horarios: [] },
      { dia: 'Viernes', horarios: [] },
      { dia: 'Sábado', horarios: [] },
      { dia: 'Domingo', horarios: [] }
    ];
  }

  private obtenerURLsImagenes(imagenes: File[] | string[]): string[] {
    return imagenes.map(imagen => {
      if (typeof imagen === 'string') {
        return imagen;
      } else {
        return URL.createObjectURL(imagen);
      }
    });
  }

  actualizarPerfil(): void {
    if (this.usuario) {
      this.usuarioService.actualizarUsuario(this.usuario).then(() => {
        console.log('Perfil actualizado correctamente.');
      }).catch(error => {
        console.error('Error al actualizar perfil:', error);
      });
    }
  }

  agregarHorario(diaIndex: number): void {
    if (!this.disponibilidadHoraria[diaIndex].horarios) {
      this.disponibilidadHoraria[diaIndex].horarios = [];
    }
    this.disponibilidadHoraria[diaIndex].horarios.push({ inicio: '', fin: '' });
  }

  eliminarHorario(diaIndex: number, horarioIndex: number): void {
    this.disponibilidadHoraria[diaIndex].horarios.splice(horarioIndex, 1);
  }

  guardarDisponibilidad(): void {
    if (this.usuario && this.usuario.uid) {
      const horariosValidos = this.disponibilidadHoraria.every(dia =>
        dia.horarios.every(horario => horario.inicio && horario.fin)
      );

      if (horariosValidos) {
        this.especialistaService.guardarDisponibilidad(this.usuario.uid, this.disponibilidadHoraria).then(() => {
          console.log('Disponibilidad horaria guardada correctamente.');
          this.cargarDisponibilidadHoraria(this.usuario!.uid);
        }).catch(error => {
          console.error('Error al guardar disponibilidad horaria:', error);
        });
      } else {
        console.error('Error: Algunos horarios no están completos.');
      }
    }
  }
}