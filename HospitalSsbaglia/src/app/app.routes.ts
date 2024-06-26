import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { logueadoGuard } from './guards/logueado.guard';

export const routes: Routes = [

    { path: 'login', loadComponent: () => import('./componentes/login/login.component').then(m => m.LoginComponent) },
    { path: 'home', loadComponent: () => import('./componentes/home/home.component').then(m => m.HomeComponent) },
    { path: 'registro', loadComponent: () => import('./componentes/registro/registro.component').then(m => m.RegistroComponent) },
    { path: 'registro-especialista', loadComponent: () => import('./componentes/registro-especialista/registro-especialista.component').then(m => m.RegistroEspecialistaComponent) },
    { path: 'pagina-error', loadComponent: () => import('./componentes/pagina-error/pagina-error.component').then(m => m.PaginaErrorComponent) },
    { path: 'spinner', loadComponent: () => import('./componentes/spinner/spinner.component').then(m => m.SpinnerComponent) },

    {path: 'homeAdmin', loadComponent: () => import('./componentes/home-admin/home-admin.component').then(m => m.HomeAdminComponent), canActivate: [adminGuard] },
     { path: 'listaUsuariosIngresados', loadComponent: () => import('./componentes/lista-usuarios-ingresados/lista-usuarios-ingresados.component').then(m => m.ListaUsuariosIngresadosComponent)  },
     { path: 'solicitudesEspecialistas', loadComponent: () => import('./componentes/specialist-requests/specialist-requests.component').then(m => m.SpecialistRequestsComponent), canActivate: [logueadoGuard]  },
     {path: 'homeRegistro', loadComponent: () => import('./componentes/home-registro/home-registro.component').then(m => m.HomeRegistroComponent) },
     {path: 'turnos', loadComponent: () => import('./componentes/turnos/turnos.component').then(m => m.TurnosComponent), canActivate: [logueadoGuard]  },
     {path: 'turnosEspecialista', loadComponent: () => import('./componentes/turnos-especialista/turnos-especialista.component').then(m => m.TurnosEspecialistaComponent), canActivate: [logueadoGuard]  },
   {path: 'turnosAdministrador', loadComponent: () => import('./componentes/turnos-administrador/turnos-administrador.component').then(m => m.TurnosAdministradorComponent), canActivate: [adminGuard] },
   {path: 'solicitarTurno', loadComponent: () => import('./componentes/solicitar-turno/solicitar-turno.component').then(m => m.SolicitarTurnoComponent), canActivate: [logueadoGuard]  },
   {path: 'miPerfil', loadComponent: () => import('./componentes/mi-perfil/mi-perfil.component').then(m => m.MiPerfilComponent), canActivate: [logueadoGuard]  },
   {path: 'historiaClinicaAdmin', loadComponent: () => import('./componentes/hist-clinica-admin/hist-clinica-admin.component').then(m => m.HistClinicaAdminComponent) , canActivate: [adminGuard]},
   {path: 'historiaClinicaEspecialista', loadComponent: () => import('./componentes/hist-clinica-especialista/hist-clinica-especialista.component').then(m => m.HistClinicaEspecialistaComponent), canActivate: [logueadoGuard]  },
   {path: 'estadisticas', loadComponent: () => import('./componentes/estadisticas/estadisticas.component').then(m => m.EstadisticasComponent), canActivate: [adminGuard]},
     { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'pagina-error' }

];
