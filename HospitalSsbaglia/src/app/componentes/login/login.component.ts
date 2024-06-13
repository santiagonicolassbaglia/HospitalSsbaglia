import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PaginaErrorComponent } from '../pagina-error/pagina-error.component';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { SpinnerService } from '../../services/spinner.service';
import { CaptchaComponent } from '../captcha/captcha.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, PaginaErrorComponent, NgIf, CaptchaComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  mail: string = '';
  clave: string = '';
  mensajeError: string = '';
  recordarme: boolean = false;
  captchaVerified: boolean = false;
  private fb = inject(FormBuilder);
  protected form: FormGroup;
  @Output() nombreUsuarioEmitido = new EventEmitter<string>();

  constructor(private router: Router, private authService: AuthService, private loadingService: SpinnerService) {}

  ngOnInit(): void {
    this.authService.esAdmin = false;

    const usuarioGuardado = localStorage.getItem('usuarioGuardado');
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      this.mail = usuario.mail;
      this.clave = usuario.clave;
      this.recordarme = true;
    }
  }

  async login() {
    if (!this.captchaVerified) {
      this.mensajeError = 'Por favor, resuelve el captcha primero.';
      return;
    }

    this.loadingService.show();

    setTimeout(() => {
      this.loadingService.hide();
    }, 3000);

    try {
      await this.authService.login(this.mail, this.clave);
      this.router.navigateByUrl('home');
    } catch (error) {
      console.log('Error de inicio de sesión:', error);
      this.mensajeError = 'El correo electrónico o la contraseña son incorrectos';
    }
  }

  usuarioPorDefecto() {
    this.mail = 'santiii@gmail.com';
    this.clave = '123456';
    this.authService.esAdmin = true;
  }

  async loginWithGoogle() {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigateByUrl('/home');
    } catch (error) {
      console.log('Error de inicio de sesión con Google:', error);
    }
  }

  onCaptchaResolved(resolved: boolean) {
    this.captchaVerified = resolved;
    this.mensajeError = resolved ? '' : 'Captcha incorrecto. Por favor, inténtalo de nuevo.';
  }
}
