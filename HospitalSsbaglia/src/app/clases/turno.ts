import { Usuario } from "./usuario";

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
  hora: string;
  idusuario: string;

  constructor(init?: Partial<Turno>) {
    Object.assign(this, init);
  }
}
