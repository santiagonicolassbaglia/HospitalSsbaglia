import { HistoriaClinica } from "./historia-clinica";

export class Turno {
  constructor(
    public id: string,
    public pacienteId: string,
    public pacienteNombre: string,
    public especialidad: string,
    public especialistaId: string,
    public especialistaNombre: string,
    public fechaHora: Date,    
    public estado: 'pendiente' | 'confirmado' | 'cancelado' | 'realizado' = 'pendiente',
    public comentario?: string,
    public dniUsuario?: string,
    public mostrarresenia?: boolean,
    public mostrarcomentario?: boolean,
    public historiaClinica?: HistoriaClinica 
    
  ) {}
}
