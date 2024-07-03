import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../Interfaces/usuario';
import { EspecialistaService } from '../../services/especialista.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Disponibilidad, Especialista } from '../../Interfaces/especialista';
import { HistoriaClinica } from '../../clases/historia-clinica';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';
import { jsPDF } from 'jspdf';
import { EspecialidadesPipe } from '../../pipes/especialidades.pipe';
import { DisponibilidadPipe } from '../../pipes/disponibilidad.pipe';
import { OrdenarHistoriasPipe } from '../../pipes/ordenar-historias.pipe';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, DatePipe, EspecialidadesPipe, DisponibilidadPipe, OrdenarHistoriasPipe],
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {
  usuario: Usuario | Especialista | undefined;
  esEspecialista = false;
  disponibilidadHoraria: Disponibilidad[] = [];
  imagenes: string[] = [];
  historiasClinicas: HistoriaClinica[] = [];
  historiasClinicasFiltradas: HistoriaClinica[] = [];
  historiaClinicaReciente: HistoriaClinica | undefined;
  especialidades: string[] = [];
  especialidadSeleccionada = '';

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private especialistaService: EspecialistaService,
    private historiaClinicaService: HistoriaClinicaService  
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.usuarioService.getUsuario(user.uid).subscribe(usuario => {
          this.usuario = usuario;
          if (usuario) {
            this.imagenes = this.obtenerURLsImagenes(usuario.imagenes);
          }
          if (usuario && (usuario as Especialista).especialidad.length > 0) {
            this.esEspecialista = true;
            this.cargarDisponibilidadHoraria(user.uid);
          }
          if (usuario) {
            this.cargarHistoriasClinicas(usuario.uid);
          }
        });
      }
    });
  }

  private cargarDisponibilidadHoraria(uid: string): void {
    this.especialistaService.getDisponibilidad(uid).subscribe(disponibilidad => {
      this.disponibilidadHoraria = disponibilidad.length ? disponibilidad : this.inicializarDisponibilidad();
    });
  }

  private inicializarDisponibilidad(): Disponibilidad[] {
    return [
      { dia: 'Lunes', horarios: [] },
      { dia: 'Martes', horarios: [] },
      { dia: 'Miércoles', horarios: [] },
      { dia: 'Jueves', horarios: [] },
      { dia: 'Viernes', horarios: [] },
      { dia: 'Sábado', horarios: [] },
      { dia: 'Domingo', horarios: [] }
    ];
  }

  private obtenerURLsImagenes(imagenes: File[] | string[]): string[] {
    return imagenes.map(imagen => {
      if (typeof imagen === 'string') {
        return imagen;
      } else {
        return URL.createObjectURL(imagen);
      }
    });
  }
  actualizarPerfil(): void {
    if (this.usuario) {
      this.usuarioService.actualizarUsuario(this.usuario).then(() => {
        console.log('Perfil actualizado correctamente.');
      }).catch(error => {
        console.error('Error al actualizar perfil:', error);
      });
    }
  }

  agregarHorario(diaIndex: number): void {
    if (!this.disponibilidadHoraria[diaIndex].horarios) {
      this.disponibilidadHoraria[diaIndex].horarios = [];
    }
    this.disponibilidadHoraria[diaIndex].horarios.push({ inicio: '', fin: '' });
  }

  eliminarHorario(diaIndex: number, horarioIndex: number): void {
    this.disponibilidadHoraria[diaIndex].horarios.splice(horarioIndex, 1);
  }

  guardarDisponibilidad(): void {
    if (this.usuario && this.usuario.uid) {
      const horariosValidos = this.disponibilidadHoraria.every(dia =>
        dia.horarios.every(horario => horario.inicio && horario.fin)
      );

      if (horariosValidos) {
        this.especialistaService.guardarDisponibilidad(this.usuario.uid, this.disponibilidadHoraria).then(() => {
          console.log('Disponibilidad horaria guardada correctamente.');
          this.cargarDisponibilidadHoraria(this.usuario!.uid);
        }).catch(error => {
          console.error('Error al guardar disponibilidad horaria:', error);
        });
      } else {
        console.error('Error: Algunos horarios no están completos.');
      }
    }
  }
  private convertirTimestampAFecha(historia: HistoriaClinica): HistoriaClinica {
    return {
      ...historia,
      fecha: (historia.fecha as any).toDate()
    };
  }

  private cargarHistoriasClinicas(uid: string): void {
    this.historiaClinicaService.obtenerHistoriasPorPaciente(uid).subscribe(historial => {
      this.historiasClinicas = historial.map(e => {
        const historiaClinica = {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as HistoriaClinica
        };

        // Convertir Timestamp a Date
        const historiaConFechaConvertida = this.convertirTimestampAFecha(historiaClinica);

        // Filtrar historias clínicas con datos completos
        const { fecha, altura, peso, temperatura, presion, nombreEspecialista } = historiaConFechaConvertida;
        if (fecha && altura && peso && temperatura && presion) {
          return historiaConFechaConvertida;
        } else {
          return null;
        }
      }).filter(historia => historia !== null);

      // Obtener especialidades únicas
      this.especialidades = [...new Set(this.historiasClinicas.map(historia => historia.nombreEspecialista))]; 
  

      

      

      // Filtrar historias clínicas por especialidad seleccionada
      this.filtrarHistoriasClinicas();
    });
  }

  // filtrarHistoriasClinicas(): void {
  //   if (this.especialidadSeleccionada) {
  //     this.historiasClinicasFiltradas = this.historiasClinicas.filter(historia => historia.nombreEspecialista === this.especialidadSeleccionada);
  //   } else {
  //     this.historiasClinicasFiltradas = [...this.historiasClinicas];
  //   }

  //   // Obtener la historia clínica más reciente
  //   this.historiaClinicaReciente = this.historiasClinicasFiltradas.reduce((acc, curr) => {
  //     return (!acc || curr.fecha > acc.fecha) ? curr : acc;
  //   }, undefined);

filtrarHistoriasClinicas(): void {
  if (this.especialidadSeleccionada) {
    this.historiasClinicasFiltradas = this.historiasClinicas.filter(historia => historia.nombreEspecialista === this.especialidadSeleccionada);
  } else {
    this.historiasClinicasFiltradas = [...this.historiasClinicas];
  }

  // Obtener la historia clínica más reciente
  this.historiaClinicaReciente = this.historiasClinicasFiltradas.reduce((acc, curr) => {
    return (!acc || curr.fecha > acc.fecha) ? curr : acc;
  }, undefined);

  // Update the especialidadSeleccionada with the speciality of the specialist
  if (this.historiaClinicaReciente) {
    const especialista = this.historiaClinicaReciente.nombreEspecialista;
    const especialidad = this.historiaClinicaReciente.especialidad;
    this.especialidadSeleccionada = `${especialista} ${especialidad}`;
  }
}
  

 
  generatePDF(): void {
    const doc = new jsPDF();

    let y = 10; // Posición inicial en el eje Y

    doc.text('Historia Clínica', 10, y);
    y += 10;

    this.historiasClinicasFiltradas.forEach(historia => {
      doc.text(`Fecha: ${new Date(historia.fecha).toLocaleString()}`, 10, y);
      y += 10;
      doc.text(`Altura: ${historia.altura} cm`, 10, y);
      y += 10;
      doc.text(`Peso: ${historia.peso} kg`, 10, y);
      y += 10;
      doc.text(`Temperatura: ${historia.temperatura} °C`, 10, y);
      y += 10;
      doc.text(`Presión: ${historia.presion}`, 10, y);
      y += 10;
      historia.datosDinamicos.forEach(dato => {
        doc.text(`${dato.clave}: ${dato.valor}`, 10, y);
        y += 10;
      });
      y += 10; // Espacio entre historias
    });

    doc.save('historia_clinica.pdf');
  }
  }
 