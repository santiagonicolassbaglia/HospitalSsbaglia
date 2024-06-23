import { Usuario } from "./usuario";

 


export interface Disponibilidad {
    dia: string;
    horarios: { inicio: string; fin: string }[];
  }

export interface Especialista extends Usuario {
  especialidad: string[];
  disponibilidadHoraria: Disponibilidad[];
  anosDeExperiencia?: number;
}