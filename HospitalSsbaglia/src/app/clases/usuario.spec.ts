import { Usuario } from './usuario';

describe('Usuario', () => {
  it('should create an instance', () => {
    const uid = "uid";
    const nombre = "nombre";
    const apellido = "apellido";
    const dni = "dni";
    const edad = 1;
    const obraSocial = "obraSocial";
    const especialidad = ["especialidad"];
    const contraseña = "contraseña";
    const mail = "mail";
    const imagenes = [new File([""], "imagen.jpg")];
    const code = "code";
    const lastLogin = new Date();
    const esAdmin = false;
    const aprobado = false;

    const usuario = new Usuario(
      uid,
      nombre,
      apellido,
      dni,
      edad,
      obraSocial,
      especialidad,
      contraseña,
      mail,
      imagenes,
      code,
      lastLogin,
      esAdmin,
      aprobado
    );

    expect(usuario).toBeTruthy();
  });
});
