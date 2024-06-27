import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map, tap } from 'rxjs';

export const logueadoGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.getCurrentUser().pipe(
    map(user => !!user), // Si hay un usuario logueado, devuelve true
    tap(loggedIn => {
      if (!loggedIn) {
        console.error('Acceso denegado - Usuario no autenticado');
        window.location.href = '/login'; 
      }
    })
  );
};
