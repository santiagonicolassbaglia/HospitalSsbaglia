import { Component, OnInit } from '@angular/core';
 
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { Usuario } from '../../clases/usuario';
import { AuthService } from '../../services/auth.service';
import { ListaUsuariosIngresadosComponent } from '../lista-usuarios-ingresados/lista-usuarios-ingresados.component';
import { RegistroComponent } from '../registro/registro.component';
import { RegistroEspecialistaComponent } from '../registro-especialista/registro-especialista.component';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [NgIf,FormsModule,RouterLink,LoginComponent,ListaUsuariosIngresadosComponent,RegistroComponent,RegistroEspecialistaComponent],
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css']

})
export class HomeAdminComponent implements OnInit  {
  user: any;
  username: string = '';
  nombreUsuario: string = '';

  constructor( private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.getUserProfile();
  }

 
  getUserProfile(): void {
     
    this.authService.usuarioActual().then((usuario: Usuario) => {
      if (usuario) {
        this.nombreUsuario = usuario.nombre;
      } 
    }).catch(error => {
      console.error('Error al obtener el usuario actual:', error);
    });
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
}