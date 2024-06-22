import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../Interfaces/usuario';
import { EspecialistaService } from '../../services/especialista.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Disponibilidad, Especialista } from '../../Interfaces/especialista';
import { of } from 'rxjs';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [NgIf,NgFor,FormsModule],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent  implements OnInit {
  usuario: Usuario | Especialista | undefined;
  esEspecialista = false;
  disponibilidadHoraria: Disponibilidad[] = [];
  imagenes: string[] = [];
  diasDisponibles: string[] = [];
  
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
      this.disponibilidadHoraria = disponibilidad.length ? disponibilidad : [{ dia: 'Lunes', horarios: [{ inicio: '', fin: '' }] }];
    });
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

  agregarDisponibilidad(dia: string): void {
    this.disponibilidadHoraria.push({ dia, horarios: [{ inicio: '', fin: '' }] });
  }

  agregarHorario(diaIndex: number): void {
    this.disponibilidadHoraria[diaIndex].horarios.push({ inicio: '', fin: '' });
  }

  guardarDisponibilidad(): void {
    if (this.usuario && this.usuario.uid) {
      this.especialistaService.guardarDisponibilidad(this.usuario.uid, this.disponibilidadHoraria).then(() => {
        console.log('Disponibilidad horaria guardada correctamente.');
      }).catch(error => {
        console.error('Error al guardar disponibilidad horaria:', error);
      });
    }
  }
}