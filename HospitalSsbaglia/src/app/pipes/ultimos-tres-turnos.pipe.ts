import { Pipe, PipeTransform } from '@angular/core';
import { Turno } from '../clases/turno';
import { HistoriaClinica } from '../clases/historia-clinica';

@Pipe({
  name: 'ultimosTresTurnos',
  standalone: true
})
export class UltimosTresTurnosPipe implements PipeTransform {
 
  transform(historiasClinicas: HistoriaClinica[], mostrarUltimasTres: boolean = false): HistoriaClinica[] {
    if (!historiasClinicas || historiasClinicas.length === 0) {
      return [];
    }

    if (mostrarUltimasTres) {
      return historiasClinicas
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 3);
    } else {
      return historiasClinicas;
    }
  }

}
