import { Pipe, PipeTransform } from '@angular/core';
import { HistoriaClinica } from '../clases/historia-clinica';

@Pipe({
  name: 'ordenarHistorias',
  standalone: true
})
export class OrdenarHistoriasPipe implements PipeTransform {

  transform(historias: HistoriaClinica[]): HistoriaClinica[] {
    return historias.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }

}
//Para asegurarnos de que las historias clínicas se muestren en orden cronológico.