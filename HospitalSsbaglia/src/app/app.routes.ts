import { Routes } from '@angular/router';

export const routes: Routes = [

    { path: 'login', loadComponent: () => import('./componentes/login/login.component').then(m => m.LoginComponent) },
    { path: 'home', loadComponent: () => import('./componentes/home/home.component').then(m => m.HomeComponent) },
    { path: 'registro', loadComponent: () => import('./componentes/registro/registro.component').then(m => m.RegistroComponent) },
    { path: 'registro-especialista', loadComponent: () => import('./componentes/registro-especialista/registro-especialista.component').then(m => m.RegistroEspecialistaComponent) },
    { path: 'pagina-error', loadComponent: () => import('./componentes/pagina-error/pagina-error.component').then(m => m.PaginaErrorComponent) },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'pagina-error' }

];
