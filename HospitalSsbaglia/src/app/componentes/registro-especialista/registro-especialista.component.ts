import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { Usuario } from '../../clases/usuario';
import { AuthService } from '../../services/auth.service';
import { SpinnerService } from '../../services/spinner.service';
import { CaptchaComponent } from '../captcha/captcha.component';

@Component({
  selector: 'app-registro-especialista',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, RouterLink, NgFor, CaptchaComponent],
  templateUrl: './registro-especialista.component.html',
  styleUrls: ['./registro-especialista.component.css']
})
export class RegistroEspecialistaComponent implements OnInit {
  form: FormGroup;
  mensajeError: string = '';
  especialidades: string[] = ['Cardiología', 'Dermatología', 'Neurología', 'Pediatría'];
  captchaVerified: boolean = false;

  private fb = inject(FormBuilder);

  constructor(private authService: AuthService, private router: Router, private loadingService: SpinnerService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
      edad: ['', [Validators.required, Validators.min(1)]],
      especialidades: this.fb.array([this.createEspecialidadGroup()]),
      mail: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      imagenes: [null, Validators.required]
    });
  }

  createEspecialidadGroup() {
    return this.fb.group({
      especialidad: ['', Validators.required],
      otraEspecialidad: ['']
    });
  }

  get especialidadesArray(): FormArray {
    return this.form.get('especialidades') as FormArray;
  }

  agregarEspecialidad() {
    this.especialidadesArray.push(this.createEspecialidadGroup());
  }

  eliminarEspecialidad(index: number) {
    this.especialidadesArray.removeAt(index);
  }

  registrar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    } 
     if (!this.captchaVerified) {
      this.mensajeError = 'Por favor, resuelve el captcha primero.';
      return;
    }

    this.loadingService.show();
    setTimeout(() => this.loadingService.hide(), 6000);

    const { nombre, apellido, dni, edad, especialidades, mail, clave, imagenes } = this.form.value;
    const finalEspecialidades = especialidades.map((esp: any) =>
      esp.especialidad === 'Otra' ? esp.otraEspecialidad : esp.especialidad
    );
    const imagenesArray = Array.isArray(imagenes) ? imagenes : [imagenes];

    const nuevoUsuario = new Usuario(
      '',
      nombre,
      apellido,
      dni,
      edad,
      null,
      finalEspecialidades,
      clave,
      mail,
      imagenesArray,
      this.generateUserCode(),
      null,
      false
    );

    this.authService.registrarEspecialista(nuevoUsuario).then(() => {
      this.router.navigateByUrl('/login');
    }).catch((error) => {
      this.mensajeError = 'Hubo un problema al registrar el usuario. Inténtalo de nuevo.';
      console.error('Error al registrar usuario:', error);
    });
  }

  private generateUserCode(): string {
    return 'some-unique-code';
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      const fileArray = Array.from(files).map((file: File) => file);
      this.form.patchValue({ imagenes: fileArray });
    }
  }

  onCaptchaResolved(resolved: boolean) {
    this.captchaVerified = resolved;
    this.mensajeError = resolved ? '' : 'Captcha incorrecto. Por favor, inténtalo de nuevo.';
  }
}
