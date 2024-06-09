import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { PaginaErrorComponent } from './componentes/pagina-error/pagina-error.component';
import { HomeComponent } from './componentes/home/home.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { RegistroEspecialistaComponent } from './componentes/registro-especialista/registro-especialista.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FormsModule,CommonModule,RouterLink,RouterOutlet,LoginComponent,PaginaErrorComponent,HomeComponent,RegistroComponent,RegistroEspecialistaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'HospitalSsbaglia';
}
