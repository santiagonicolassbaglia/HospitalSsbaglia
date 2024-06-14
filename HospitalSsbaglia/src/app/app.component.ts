// app.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { PaginaErrorComponent } from './componentes/pagina-error/pagina-error.component';
import { HomeComponent } from './componentes/home/home.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { RegistroEspecialistaComponent } from './componentes/registro-especialista/registro-especialista.component';
import { SpinnerComponent } from './componentes/spinner/spinner.component';
import { SpinnerService } from './services/spinner.service';
import { Subscription } from 'rxjs';
import { CaptchaComponent } from './componentes/captcha/captcha.component';
import { ListaUsuariosIngresadosComponent } from './componentes/lista-usuarios-ingresados/lista-usuarios-ingresados.component';
import { Usuario } from './clases/usuario';
import { HomeAdminComponent } from './componentes/home-admin/home-admin.component';
import { HomeRegistroComponent } from './componentes/home-registro/home-registro.component';
 
 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    CommonModule,
    RouterLink,
    RouterOutlet,
    LoginComponent,
    PaginaErrorComponent,
    HomeComponent,
    RegistroComponent,
    RegistroEspecialistaComponent,
    SpinnerComponent,
    CaptchaComponent,
    HomeAdminComponent,
    ListaUsuariosIngresadosComponent,
    HomeRegistroComponent,


  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // <- Correction here
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'HospitalSsbaglia';
  isLoading: boolean = false;
  private subscription: Subscription;

  constructor(private loadingService: SpinnerService) {}

  ngOnInit() {
    this.subscription = this.loadingService.loading$.subscribe(
      (isLoading: boolean) => {
        this.isLoading = isLoading;
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
