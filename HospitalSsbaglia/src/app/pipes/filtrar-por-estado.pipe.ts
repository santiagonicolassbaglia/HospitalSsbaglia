import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrarPorEstado',
  standalone: true
})
export class FiltrarPorEstadoPipe implements PipeTransform {

  transform(items: any[], estado: string): any[] {
    if (!items) return [];
    if (!estado) return items;

    return items.filter(item => item.estado === estado);
  }

}
