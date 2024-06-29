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
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, DatePipe],
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

  private cargarHistoriasClinicas(uid: string): void {
    this.historiaClinicaService.obtenerHistoriasPorPaciente(uid).subscribe(historial => {
      this.historiasClinicas = historial.map(e => {
        const historiaClinica = {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as HistoriaClinica
        };
        
        // Filtrar historias clínicas con datos completos
        const { fecha, altura, peso, temperatura, presion, nombreEspecialista } = historiaClinica;
        if (fecha && altura && peso && temperatura && presion) {
          return historiaClinica;
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

  filtrarHistoriasClinicas(): void {
    if (this.especialidadSeleccionada) {
      this.historiasClinicasFiltradas = this.historiasClinicas.filter(historia => historia.nombreEspecialista === this.especialidadSeleccionada);
    } else {
      this.historiasClinicasFiltradas = this.historiasClinicas;
    }
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

  generatePDF(): void {
    const doc = new jsPDF();
  
    //  logo de la clínica
    const logoURL = '../../../assets/imagenes/cruzRoja.png';  
    const img = new Image();
    img.src = logoURL;
  
    img.onload = () => {
      doc.addImage(img, 'PNG', 10, 10, 50, 20);
      
      //  título  
      doc.setFontSize(18);
      doc.text('Informe de Historia Clínica', 70, 20);
      doc.setFontSize(12);
      doc.text('Fecha de emisión: ' + new Date().toLocaleDateString(), 70, 30);
  
      // datos del usuario
      doc.setFontSize(12);
      doc.text(`Nombre: ${this.usuario.nombre}`, 10, 50);
      doc.text(`Apellido: ${this.usuario.apellido}`, 10, 60);
      doc.text(`DNI: ${this.usuario.dni}`, 10, 70);
      doc.text(`Edad: ${this.usuario.edad}`, 10, 80);
      doc.text(`Obra Social: ${this.usuario.obraSocial || 'No especificada'}`, 10, 90);
      doc.text(`Correo Electrónico: ${this.usuario.mail}`, 10, 100);
      let y = 120;
  this.historiasClinicasFiltradas.forEach(historia => {
    doc.text(`Fecha: ${new Date(historia.fecha).toLocaleDateString()}`, 10, y);
    doc.text(`Altura: ${historia.altura} cm`, 10, y + 10);
    doc.text(`Peso: ${historia.peso} kg`, 10, y + 20);
    doc.text(`Temperatura: ${historia.temperatura} °C`, 10, y + 30);
    doc.text(`Presión: ${historia.presion}`, 10, y + 40);
    y += 60;
  });

  doc.save('historia_clinica.pdf');
};
}}