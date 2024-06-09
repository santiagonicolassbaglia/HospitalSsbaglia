import { Usuario } from './usuario';

describe('Usuario', () => {
  it('should create an instance', () => {
   expect(new Usuario( "nombre", "apellido", "dni", 1, "obraSocial", "especialidad", "contraseña", "mail", ["imagenes"], "code", new Date())).toBeTruthy();
  });//generado automaticamente
});
