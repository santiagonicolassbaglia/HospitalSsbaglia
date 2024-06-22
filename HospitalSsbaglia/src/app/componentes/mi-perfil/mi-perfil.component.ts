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
  diasDisponibles: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

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
      this.disponibilidadHoraria = disponibilidad.length ? disponibilidad : [];
      const diasConDisponibilidad = this.disponibilidadHoraria.map(d => d.dia);
      this.diasDisponibles = this.diasDisponibles.filter(dia => !diasConDisponibilidad.includes(dia));
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

  agregarHorario(diaIndex: number): void {
    this.disponibilidadHoraria[diaIndex].horarios.push({ inicio: '', fin: '' });
  }

  agregarDisponibilidad(dia: string): void {
    this.disponibilidadHoraria.push({ dia: dia, horarios: [{ inicio: '', fin: '' }] });
    this.diasDisponibles = this.diasDisponibles.filter(d => d !== dia);
  }

  eliminarDisponibilidad(dia: string): void {
    this.disponibilidadHoraria = this.disponibilidadHoraria.filter(d => d.dia !== dia);
    if (!this.diasDisponibles.includes(dia)) {
      this.diasDisponibles.push(dia);
    }
  }

  guardarDisponibilidad(): void {
    if (this.usuario && this.usuario.uid) {
      this.especialistaService.guardarDisponibilidad(this.usuario.uid, this.disponibilidadHoraria).then(() => {
        console.log('Disponibilidad horaria guardada correctamente.');
        // Recargar la disponibilidad actualizada después de guardar
        this.cargarDisponibilidadHoraria(this.usuario!.uid);
      }).catch(error => {
        console.error('Error al guardar disponibilidad horaria:', error);
      });
    }
  }
}