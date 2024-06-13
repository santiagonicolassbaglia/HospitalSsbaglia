import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [

    { path: 'login', loadComponent: () => import('./componentes/login/login.component').then(m => m.LoginComponent) },
    { path: 'home', loadComponent: () => import('./componentes/home/home.component').then(m => m.HomeComponent) },
    { path: 'registro', loadComponent: () => import('./componentes/registro/registro.component').then(m => m.RegistroComponent) },
    { path: 'registro-especialista', loadComponent: () => import('./componentes/registro-especialista/registro-especialista.component').then(m => m.RegistroEspecialistaComponent) },
    { path: 'pagina-error', loadComponent: () => import('./componentes/pagina-error/pagina-error.component').then(m => m.PaginaErrorComponent) },
    { path: 'spinner', loadComponent: () => import('./componentes/spinner/spinner.component').then(m => m.SpinnerComponent) },

    {path: 'homeAdmin', loadComponent: () => import('./componentes/home-admin/home-admin.component').then(m => m.HomeAdminComponent) },
     { path: 'listaUsuariosIngresados', loadComponent: () => import('./componentes/lista-usuarios-ingresados/lista-usuarios-ingresados.component').then(m => m.ListaUsuariosIngresadosComponent), canActivate: [adminGuard] },
     { path: 'solicitudesEspecialistas', loadComponent: () => import('./componentes/specialist-requests/specialist-requests.component').then(m => m.SpecialistRequestsComponent), canActivate: [adminGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'pagina-error' }

];
