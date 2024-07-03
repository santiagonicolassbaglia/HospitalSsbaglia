import { Pipe, PipeTransform } from '@angular/core';
import { Usuario } from '../clases/usuario';

@Pipe({
  name: 'filtrarAdmin',
  standalone: true
})
export class FiltrarAdminPipe implements PipeTransform {

  transform(usuarios: Usuario[], esAdmin: boolean | null): Usuario[] {
    if (!usuarios) return [];
    if (esAdmin === null) return usuarios; // No filtrar si esAdmin es null
    return usuarios.filter(usuario => usuario.esAdmin === esAdmin);
  }

}
