export class Usuario {
  public uid: string; 
  public nombre: string;
  public apellido: string;
  public dni: string;
  public edad: number;
  public obraSocial: string | null = null;
  public especialidad: string[] = [];
  public contraseña: string;
  public mail: string;
  public imagenes: File[] | string[];
  public aprobado: boolean | null = null;
  public code: string;
  public lastLogin: Date | null = null;
  public esAdmin: boolean = false;
  public idTurnos: string[] = []; 
  constructor(
    uid: string, 
    nombre: string,
    apellido: string,
    dni: string,
    edad: number,
    obraSocial: string | null,
    especialidad: string[] = [] ,
    contraseña: string,
    mail: string,
    imagenes: File[] | string[],
    code: string,
    lastLogin: Date | null,
    esAdmin: boolean = false,
    aprobado: boolean | null = null,
    idTurnos: string[] = []  
  ) {
    this.uid = uid; 
    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni;
    this.edad = edad;
    this.obraSocial = obraSocial;
    this.especialidad = especialidad;
    this.contraseña = contraseña;
    this.mail = mail;
    this.imagenes = imagenes;
    this.code = code;
    this.lastLogin = lastLogin;
    this.esAdmin = esAdmin;
    this.aprobado = aprobado;
  }
}
