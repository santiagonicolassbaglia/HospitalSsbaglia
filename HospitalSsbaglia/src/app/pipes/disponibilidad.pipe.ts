import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'disponibilidad',
  standalone: true
})
export class DisponibilidadPipe implements PipeTransform {

  transform(disponibilidad: any[], filtro: string): any[] {
    if (!filtro) return disponibilidad;
    return disponibilidad.filter(d => d.dia.toLowerCase().includes(filtro.toLowerCase()));
  }

}
// Para filtrar los horarios disponibles.