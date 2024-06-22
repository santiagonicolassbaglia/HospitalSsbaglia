export interface Usuario {
    uid: string;
  nombre: string;
  apellido: string;
  dni: string;
  edad: number;
  obraSocial: string | null;
  especialidad: string[];
  contraseña: string;
  mail: string;
  imagenes: File[] | string[];
  aprobado: boolean | null;
  code: string;
  lastLogin: Date | null;
  esAdmin: boolean;
  idTurnos: string[];
}
