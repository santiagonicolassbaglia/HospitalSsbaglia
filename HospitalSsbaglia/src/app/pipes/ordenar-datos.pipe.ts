import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordenarDatos',
  standalone: true
})
export class OrdenarDatosPipe implements PipeTransform {
  transform(array: any[], field: string): any[] {
    if (!array || !field) return array;

    array.sort((a, b) => {
      if (a[field] < b[field]) return -1;
      if (a[field] > b[field]) return 1;
      return 0;
    });

    return array;
  }
}
