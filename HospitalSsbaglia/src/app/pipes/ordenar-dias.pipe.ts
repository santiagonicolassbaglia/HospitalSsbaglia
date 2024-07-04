import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordenarDias',
  standalone: true
})
export class OrdenarDiasPipe implements PipeTransform {

 
  transform(disponibilidad: { dia: string, horarios: any[] }[]): any[] {
    const ordenDias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return disponibilidad.sort((a, b) => {
      return ordenDias.indexOf(a.dia) - ordenDias.indexOf(b.dia);
    });
  }

}
