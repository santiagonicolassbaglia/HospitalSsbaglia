import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginaErrorComponent } from '../pagina-error/pagina-error.component';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Usuario } from '../../clases/usuario';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro-especialista',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, PaginaErrorComponent, NgIf,RouterLink,NgFor],
  templateUrl: './registro-especialista.component.html',
  styleUrl: './registro-especialista.component.css'
})
export class RegistroEspecialistaComponent implements OnInit {

  
  form: FormGroup;
  mensajeError: string = '';
  especialidades: string[] = ['Cardiología', 'Dermatología', 'Neurología', 'Pediatría'];

  private fb = inject(FormBuilder);

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
      edad: ['', [Validators.required, Validators.min(1)]],
      especialidad: ['', Validators.required],
      otraEspecialidad: [''],
      mail: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      imagenes: [null, Validators.required]
    });
  }

  registrar() {
    if (this.hasError()) {
      return;
    }

    const { nombre, apellido, dni, edad, especialidad, otraEspecialidad, mail, clave, imagenes } = this.form.value;
    const finalEspecialidad = especialidad === 'Otra' ? otraEspecialidad : especialidad;
    const imagenesArray = Array.isArray(imagenes) ? imagenes : [imagenes];

    const nuevoUsuario = new Usuario(
      nombre,
      apellido,
      dni,
      edad,
      null,
      finalEspecialidad || null,
      clave,
      mail,
      imagenesArray,
      this.generateUserCode(),
      null
    );

    this.authService.registrar(nuevoUsuario).then(() => {
      this.router.navigateByUrl('/login');
    }).catch((error) => {
      this.mensajeError = 'Hubo un problema al registrar el usuario. Inténtalo de nuevo.';
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

  onEspecialidadChange(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue === 'Otra') {
      this.form.get('otraEspecialidad')?.setValidators([Validators.required]);
    } else {
      this.form.get('otraEspecialidad')?.clearValidators();
    }
    this.form.get('otraEspecialidad')?.updateValueAndValidity();
  }
}