import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, map } from 'rxjs';
import { Turno } from '../clases/turno';
import { DocumentReference } from 'firebase/firestore';
import { AuthService } from './auth.service';
import { Usuario } from '../clases/usuario';
import { HistoriaClinica } from '../clases/historia-clinica';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  
  private PATH = 'Turnos';

  constructor(private firestore: AngularFirestore) {}

  public getTurnos(): Observable<Turno[]> {
    return this.firestore.collection<Turno>(this.PATH).valueChanges().pipe(
      map(turnos => turnos.map(turno => {
        turno.fechaHora = (turno.fechaHora as any).toDate ? (turno.fechaHora as any).toDate() : new Date(turno.fechaHora);
        return turno;
      }))
    );
  }

  public getTurnosByPaciente(pacienteId: string): Observable<Turno[]> {
    return this.firestore.collection<Turno>(this.PATH, ref => ref.where('pacienteId', '==', pacienteId)).valueChanges();
  }
  
  public async crearTurno(turno: Turno): Promise<void> {
    const id = this.firestore.createId();
    turno.id = id;
   
    const turnoData = Object.fromEntries(Object.entries(turno).filter(([_, v]) => v !== undefined));
  
    return this.firestore.collection(this.PATH).doc(id).set(turnoData);
  }

  public async actualizarTurno(turno: Turno): Promise<void> {
    const turnoData = Object.fromEntries(Object.entries(turno).filter(([_, v]) => v !== undefined));
    return this.firestore.collection(this.PATH).doc(turno.id).update(turnoData);
  }
  

  public async eliminarTurno(id: string): Promise<void> {
    return this.firestore.collection(this.PATH).doc(id).delete();
  }

  getTurnosByEspecialista(especialistaId: string): Observable<Turno[]> {
    return this.firestore.collection(this.PATH, ref => ref.where('especialistaId', '==', especialistaId)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Turno;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  cargarHistoriasClinicas(turnos: Turno[]): Observable<Turno[]> {
    return this.firestore.collection('historiasClinicas').snapshotChanges().pipe(
      map(actions => {
        const historiasClinicas = actions.map(a => {
          const data = a.payload.doc.data() as HistoriaClinica;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
        return turnos.map(turno => {
          turno.fechaHora = this.convertTimestampToDate(turno.fechaHora);
          turno.historiaClinica = historiasClinicas.find(historia => historia.turnoId === turno.id);
          return turno;
        });
      })
    );
  }
  
  private convertTimestampToDate(timestamp: any): Date {
    return timestamp instanceof Date ? timestamp : timestamp.toDate();
  }
  

  obtenerEncuesta(turnoId: string): Observable<any> {
    return this.firestore.collection('Encuestas').doc(turnoId).valueChanges();
  }

  obtenerReseña(turnoId: string): Observable<any> {
    return this.firestore.collection('comentario').doc(turnoId).valueChanges();
  }

  obtenerComentario(turnoId: string): Observable<any> {
    return this.firestore.collection('comentario').doc(turnoId).valueChanges();
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
