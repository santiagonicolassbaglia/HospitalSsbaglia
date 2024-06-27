export class HistoriaClinica {
  
        id: string;
        turnoId: string;  // Añadir esta línea
        pacienteId: string;
        especialistaId: string;
        fecha: Date;
        altura: number;
        peso: number;
        temperatura: number;
        presion: string;
        nombrePaciente: string;
        nombreEspecialista: string;
        datosDinamicos: { clave: string; valor: string }[];
  
}
