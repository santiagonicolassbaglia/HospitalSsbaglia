// turno.ts

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
  
  constructor(
    id: string,
    especialidad: string,
    especialista: string,
    fecha: Date,
    estado: string,
    paciente: string,
    resenia: string = '',
    encuestaCompletada: boolean = false,
    calificacionCompletada: boolean = false
  ) {
    this.id = id;
    this.especialidad = especialidad;
    this.especialista = especialista;
    this.fecha = fecha;
    this.estado = estado;
    this.paciente = paciente;
    this.resenia = resenia;
    this.encuestaCompletada = encuestaCompletada;
    this.calificacionCompletada = calificacionCompletada;
  }
}
