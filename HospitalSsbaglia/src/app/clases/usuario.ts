export class Usuario {
    public nombre: string;
    public apellido: string;
    public dni: string;
    public edad: number;
    public obraSocial: string | null = null;
    public especialidad: string | null = null; // null si es paciente
    public contraseña: string;
    public mail: string;
    public imagenes: File[] = [];
    public aprobado: boolean| null = null;
    public code: string;
    public lastLogin: Date | null = null;
 

    constructor(nombre: string, apellido: string, dni: string, edad: number, obraSocial: string | null, especialidad: string | null, contraseña: string, mail: string, imagenes: File[], code: string, lastLogin: Date | null, aprobado: boolean | null = null ) {
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
         this.aprobado = aprobado;
            
    }
}
