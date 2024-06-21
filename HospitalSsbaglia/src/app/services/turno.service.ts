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

  constructor(private firestore: AngularFirestore) {}

  public getTurnos(): Observable<Turno[]> {
    return this.firestore.collection<Turno>(this.PATH).valueChanges();
  }

  public getTurnosByEspecialista(especialistaId: string): Observable<Turno[]> {
    return this.firestore.collection<Turno>(this.PATH, ref => ref.where('especialistaId', '==', especialistaId)).valueChanges();
  }

  public getTurnosByPaciente(pacienteId: string): Observable<Turno[]> {
    return this.firestore.collection<Turno>(this.PATH, ref => ref.where('pacienteId', '==', pacienteId)).valueChanges();
  }

  public async crearTurno(turno: Turno): Promise<void> {
    const id = this.firestore.createId();
    turno.id = id;
    return this.firestore.collection(this.PATH).doc(id).set({ ...turno });
  }

  public async actualizarTurno(turno: Turno): Promise<void> {
    return this.firestore.collection(this.PATH).doc(turno.id).update({ ...turno });
  }

  public async eliminarTurno(id: string): Promise<void> {
    return this.firestore.collection(this.PATH).doc(id).delete();
  }





obtenerEncuesta(turnoId: string): Observable<any> {
  return this.firestore.collection('Encuestas').doc(turnoId).valueChanges();}

obtenerReseña(turnoId: string): Observable<any> {
  return this.firestore.collection('Reseñas').doc(turnoId).valueChanges();}

  















 
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