import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrarDatos',
  standalone: true
})
export class FiltrarDatosPipe implements PipeTransform {

  transform(items: any[], fields: string[], value: string): any[] {
    if (!items || !value) return items;
    return items.filter(item => 
      fields.some(field => 
        item[field] && item[field].toString().toLowerCase().includes(value.toLowerCase())
      )
    );
  }
}