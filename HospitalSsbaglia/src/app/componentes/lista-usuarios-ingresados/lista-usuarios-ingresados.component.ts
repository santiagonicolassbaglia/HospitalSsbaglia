import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Usuario } from '../../clases/usuario';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { EstadisticasComponent } from '../estadisticas/estadisticas.component';

@Component({
  selector: 'app-lista-usuarios-ingresados',
  standalone: true,
  imports:  [RouterLink, CommonModule,EstadisticasComponent ],
  templateUrl: './lista-usuarios-ingresados.component.html',
  styleUrl: './lista-usuarios-ingresados.component.css'
})
export class ListaUsuariosIngresadosComponent implements OnInit {

  usuarios$: Observable<Usuario[]>;

  mostrarEstadisticas = false;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.usuarios$ = this.authService.getAllUsers();
  }

  async cambiarEstadoAdmin(code: string, esAdmin: boolean) {
    try {
      await this.authService.cambiarEstadoAdmin(code, esAdmin);
      console.log(`Estado de admin cambiado para usuario con ID ${code}`);
      this.usuarios$ = this.authService.getAllUsers();
    } catch (error) {
      console.error('Error al cambiar estado de admin:', error);
    }
  }

  cerrarSesion() {
    this.authService.logout()
      .then(() => {
        console.log('Sesión cerrada correctamente');
        this.router.navigateByUrl('/login');
      })
      .catch(error => {
        console.error('Error al cerrar sesión:', error);
      });
  }

  async eliminarUsuario(usuario: Usuario) {
    try {
      await this.authService.eliminarUsuario(usuario.uid);
      console.log(`Usuario con UID ${usuario.uid} eliminado`);
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  }

  async cambiarAdmin(usuario: Usuario) {
    try {
      usuario.esAdmin = !usuario.esAdmin;
      await this.authService.cambiarEstadoAdmin(usuario.mail, usuario.esAdmin);
      console.log(`Estado de admin cambiado para usuario con email ${usuario.mail}`);
    } catch (error) {
      console.error('Error al cambiar estado de admin:', error);
    }
  }

  mostrarOcultarEstadisticas() {
    this.mostrarEstadisticas = !this.mostrarEstadisticas;
  }

  
}