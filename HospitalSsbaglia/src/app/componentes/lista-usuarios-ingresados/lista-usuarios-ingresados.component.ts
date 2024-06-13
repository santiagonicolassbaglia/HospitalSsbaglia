import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Usuario } from '../../clases/usuario';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-lista-usuarios-ingresados',
  standalone: true,
  imports:  [RouterLink, CommonModule ],
  templateUrl: './lista-usuarios-ingresados.component.html',
  styleUrl: './lista-usuarios-ingresados.component.css'
})
export class ListaUsuariosIngresadosComponent implements OnInit {
   
  usuarios$: Observable<Usuario[]>;

  constructor(private router: Router, private auths: AuthService) { }

  ngOnInit(): void {
    this.usuarios$ = this.auths.getAllUsers();
  }

  cerrarSesion() {
    this.auths.logout()
      .then(() => {
        console.log('Sesión cerrada correctamente');
        this.router.navigateByUrl('/login');
      })
      .catch(error => {
        console.error('Error al cerrar sesión:', error);
      });

  


}}
