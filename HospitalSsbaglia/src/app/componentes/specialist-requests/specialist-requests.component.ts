import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../clases/usuario';
@Component({
  selector: 'app-specialist-requests',
  standalone: true,
  imports:  [NgIf, NgFor, RouterLink],
  templateUrl: './specialist-requests.component.html',
  styleUrl: './specialist-requests.component.css'
})
export class SpecialistRequestsComponent implements OnInit {
  solicitudes: Usuario[] = [];
  mensajeError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerSolicitudes();
  }

  obtenerSolicitudes(): void {
    this.authService.obtenerSolicitudesEspecialistas().subscribe(
      (solicitudes: Usuario[]) => {
        this.solicitudes = solicitudes;
      },
      error => {
        this.mensajeError = 'Error al obtener las solicitudes de especialistas';
        console.error('Error al obtener las solicitudes:', error);
      }
    );
  }

  aceptarEspecialista(uid: string): void {
    this.authService.aceptarEspecialista(uid).then(() => {
      this.obtenerSolicitudes();
    }).catch(error => {
      this.mensajeError = 'Error al aceptar al especialista';
      console.error('Error al aceptar al especialista:', error);
    });
  }
}{

}
