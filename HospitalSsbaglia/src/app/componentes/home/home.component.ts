import { Component, OnInit } from '@angular/core';
 
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { Usuario } from '../../clases/usuario';
import { AuthService } from '../../services/auth.service';
import { HomeAdminComponent } from '../home-admin/home-admin.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf,FormsModule,RouterLink,LoginComponent,HomeAdminComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
   
  username: string = '';
  nombreUsuario: string = '';
user: Usuario | null = null;
  constructor(private router: Router, private authService: AuthService) { } // Inject Router service
 
  
  ngOnInit(): void {
    this.authService.usuarioActual().then((usuario: Usuario | null) => {
      if (usuario) {
        this.user = usuario;
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