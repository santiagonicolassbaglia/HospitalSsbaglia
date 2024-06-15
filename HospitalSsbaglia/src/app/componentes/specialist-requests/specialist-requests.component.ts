import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../clases/usuario';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-specialist-requests',
  standalone: true,
  imports:  [NgIf, NgFor, RouterLink, AsyncPipe],
  templateUrl: './specialist-requests.component.html',
  styleUrl: './specialist-requests.component.css'
})
export class SpecialistRequestsComponent implements OnInit {
  especialistas$: Observable<Usuario[]>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.especialistas$ = this.authService.obtenerSolicitudesEspecialistas();
  }

  aceptarEspecialista(especialista: Usuario): void {
    this.authService.aceptarEspecialista(especialista.uid).then(() => {
      alert('Especialista aceptado');
    }).catch(error => {
      console.error('Error al aceptar especialista:', error);
    });
  }

  rechazarEspecialista(especialista: Usuario): void {
    this.authService.rechazarEspecialista(especialista.uid).then(() => {
      alert('Especialista rechazado');
    }).catch(error => {
      console.error('Error al rechazar especialista:', error);
    });
    
  }
}