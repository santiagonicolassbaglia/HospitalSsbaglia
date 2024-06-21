import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, map, of, switchMap, tap } from 'rxjs';
import { Turno } from '../clases/turno';
import { DocumentReference } from 'firebase/firestore';
import { AuthService } from './auth.service';
import { Usuario } from '../clases/usuario';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private PATH = 'Turnos';
  private turnosCollection: AngularFirestoreCollection<Turno>;
  constructor(private firestore: AngularFirestore,  private authService: AuthService ) {}

  getAllTurnos(): Observable<Turno[]> {
    return this.firestore.collection<Turno>(this.PATH).valueChanges();
  }

  getTurnosByEspecialidad(especialidad: string): Observable<any[]> {
    return this.firestore.collection('Usuarios', ref => ref.where('especialidad', 'array-contains', especialidad)).valueChanges();
  }

  addTurno(turno: Turno): Promise<void> {
    const id = this.firestore.createId();
    turno.id = id;
    return this.firestore.collection(this.PATH).doc(id).set(turno);
  }

  updateTurno(id: string, turno: Partial<Turno>): Promise<void> {
    return this.firestore.collection(this.PATH).doc(id).update(turno);
  }

  deleteTurno(id: string): Promise<void> {
    return this.firestore.collection(this.PATH).doc(id).delete();
  }
 
   
 
public async solicitarTurno(turno: Turno): Promise<void> {
  const id = this.firestore.createId();
  turno.id = id;
  try {
    const dniUsuario = await this.authService.getCurrentUserDni();
    if (dniUsuario) {
      turno.dniUsuario = dniUsuario;
      await this.firestore.collection(this.PATH).doc(id).set(turno);
    } else {
      throw new Error('No se encontró el dni del usuario');
    }
  } catch (error) {
    console.error('Error al solicitar turno:', error);
    throw error;
  }
}

 
  crearTurno(turno: Turno): Promise<DocumentReference<Turno>> {
    // Convertir Turno a un objeto plano
    const turnoObj = {
      id: turno.id,
      especialidad: turno.especialidad,
      especialista: turno.especialista,
      fecha: turno.fecha,
      estado: turno.estado,
      paciente: turno.paciente,
      resenia: turno.resenia || '', // Asegúrate de manejar valores nulos o undefined
      encuestaCompletada: turno.encuestaCompletada || false,
      calificacionCompletada: turno.calificacionCompletada || false
    };

    return this.turnosCollection.add(turnoObj as Turno) as unknown as Promise<DocumentReference<Turno>>;
  }
  public obtenerEspecialistasPorEspecialidad(especialidad: string): Observable<any[]> {
    return this.firestore.collection('Usuarios', ref => ref.where('especialidad', 'array-contains', especialidad)).valueChanges();
  }

  
  getTurnosByUsuarioId(usuarioId: string): Observable<Turno[]> {
    return this.firestore.collection<Turno>(this.PATH, ref => ref.where('idusuario', '==', usuarioId)).valueChanges();
  }

getTurnosByDniUsuario(dniUsuario: string): Observable<Turno[]> {
  return this.firestore.collection<Turno>(this.PATH, ref => ref.where('dniUsuario', '==', dniUsuario)).valueChanges();
}

obtenerFechasDisponibles(especialistaId: string): Observable<string[]> {
  return this.firestore.collection('Especialistas').doc(especialistaId).valueChanges().pipe(
    map((especialista: any) => especialista.fechasDisponibles)
  );
}

obtenerEspecialidades(): Observable<string[]> {
  return this.firestore.collection('Especialidades').valueChanges().pipe(
    map((especialidades: any[]) => especialidades.map(e => e.nombre))
  );
}

obtenerEspecialistas(): Observable<Usuario[]> {
  return this.firestore.collection<Usuario>('Usuarios', ref => ref.where('especialista', '==', true)).valueChanges();
}

cancelarTurno(turnoId: string): Promise<void> {
  return this.firestore.collection(this.PATH).doc(turnoId).delete();
}

 
obtenerTurnosDisponibles = (especialistaId: string): Observable<any[]> => {
 

  return this.firestore.collection('Turnos', ref => ref.where('especialista', '==', especialistaId)).valueChanges();

}

}