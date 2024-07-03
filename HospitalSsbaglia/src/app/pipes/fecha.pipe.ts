import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fecha',
  standalone: true
})
export class FechaPipe implements PipeTransform {
  transform(value: any): any {
    const datePipe = new DatePipe('es-AR');
    return datePipe.transform(value, 'dd/MM/yyyy HH:mm'); // Cambia el formato según tus necesidades
  }

}
