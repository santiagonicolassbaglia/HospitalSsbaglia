import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'especialidades',
  standalone: true
})
export class EspecialidadesPipe implements PipeTransform {

  transform(especialidades: string[]): string {
    return especialidades.join(', ');
  }

}
//Para mostrar las especialidades en un formato adecuado.