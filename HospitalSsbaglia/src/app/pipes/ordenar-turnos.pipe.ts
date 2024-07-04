import { Pipe, PipeTransform } from '@angular/core';
import { Turno } from '../clases/turno';

@Pipe({
  name: 'ordenarTurnos',
  standalone: true
})
export class OrdenarTurnosPipe implements PipeTransform {

  transform(turnos: Turno[], campo: string = 'fechaHora', orden: 'asc' | 'desc' = 'asc'): Turno[] {
    if (!turnos || turnos.length === 0) return [];

    // Ordenar los turnos según el campo especificado
    turnos.sort((a, b) => {
      const dateA = new Date(a[campo]).getTime();
      const dateB = new Date(b[campo]).getTime();
      return orden === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return turnos;
  }
}
