import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Usuario } from '../../clases/usuario';
import { AuthService } from '../../services/auth.service';
import { PaginaErrorComponent } from '../pagina-error/pagina-error.component';
import { NgIf } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, PaginaErrorComponent, NgIf, RouterLink],
  templateUrl: './registro.component.html',
 styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
    form: FormGroup;
  mensajeError: string = '';

  private fb = inject(FormBuilder);

  constructor(private authService: AuthService, private router: Router, private loadingService: SpinnerService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
      edad: ['', [Validators.required, Validators.min(1)]],
      obraSocial: [''],
      especialidad: [''], // Agrega especialidad si corresponde
      mail: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      imagenes: [null, Validators.required]
    });
  }

  registrar() {
    if (this.form.invalid) {
      return;
    }

    this.loadingService.show();

    setTimeout(() => {
      this.loadingService.hide();
    }, 6000);

    const { nombre, apellido, dni, edad, obraSocial, especialidad, mail, clave, imagenes } = this.form.value;

    const nuevoUsuario = new Usuario(
      nombre,
      apellido,
      dni,
      edad,
      obraSocial || null,
      especialidad || null,
      clave,
      mail,
      imagenes,
      this.generateUserCode(),
      null,
      null  
    );

    this.authService.registrar(nuevoUsuario).then(() => {
      this.router.navigateByUrl('/login');
    }).catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        this.mensajeError = 'El correo electrónico ya está en uso. Por favor, use otro correo.';
      } else {
        this.mensajeError = 'Hubo un problema al registrar el usuario. Inténtalo de nuevo.';
      }
      console.error('Error al registrar usuario:', error);
    });
  }
  private hasError(): boolean {
    this.form.markAllAsTouched();
    return this.form.invalid;
  }
  private generateUserCode(): string {
    
    return 'some-unique-code';
}
    onFileChange(event: any) {
      const files = event.target.files;
      if (files.length > 0) {
        const fileArray = Array.from(files).map((file: File) => file);
        this.form.patchValue({
          imagenes: fileArray
        });
      }
  }
}