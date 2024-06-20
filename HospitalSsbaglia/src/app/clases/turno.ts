export class Turno {
  id: string;
  especialidad: string;
  especialista: string;
  fecha: Date;
  estado: string;
  paciente: string;
  resenia?: string;
  encuestaCompletada?: boolean;
  calificacionCompletada?: boolean;
  comentario?: string;
  dniUsuario: string;  



  constructor(
    id: string,
    especialidad: string,
    especialista: string,
    fecha: Date,
    estado: string,
    paciente: string,
    dniUsuario: string,
    resenia?: string,
    encuestaCompletada?: boolean,
    calificacionCompletada?: boolean,
    comentario?: string
  ) {
    this.id = id;
    this.especialidad = especialidad;
    this.especialista = especialista;
    this.fecha = fecha;
    this.estado = estado;
    this.paciente = paciente;
    this.dniUsuario = dniUsuario;
    this.resenia = resenia;
    this.encuestaCompletada = encuestaCompletada;
    this.calificacionCompletada = calificacionCompletada;
    this.comentario = comentario;
  }
}
