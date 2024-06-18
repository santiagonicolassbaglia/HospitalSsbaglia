import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, tap } from 'rxjs';
import { Turno } from '../clases/turno';
import { DocumentReference } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private turnosCollection: AngularFirestoreCollection<Turno>;

  constructor(private firestore: AngularFirestore) {
    this.turnosCollection = this.firestore.collection<Turno>('turnos');
  }

  getTurnosByPaciente(pacienteId: string): Observable<Turno[]> {
    return this.firestore.collection<Turno>('turnos', ref => ref.where('paciente', '==', pacienteId)).valueChanges();
  }

  getTurnosByEspecialista(especialistaId: string): Observable<Turno[]> {
    return this.firestore.collection<Turno>('turnos', ref => ref.where('especialista', '==', especialistaId)).valueChanges();
  }

  async cancelarTurno(turnoId: string, comentario: string): Promise<void> {
    const turnoRef = this.firestore.collection('turnos').doc(turnoId);
  
    try {
      const turnoDoc = await turnoRef.get().toPromise();
      if (turnoDoc.exists) {
        console.log('Turno encontrado con ID:', turnoId);
        await turnoRef.update({ 
          estado: 'cancelado', 
          comentario: comentario 
        });
        console.log('Turno cancelado exitosamente');
      } else {
        console.error('Turno no encontrado con ID:', turnoId);
        throw new Error('Turno no encontrado');
      }
    } catch (error) {
      console.error('Error al intentar cancelar el turno:', error);
      throw error;
    }
  }

  completarEncuesta(id: string, encuesta: string): Promise<void> {
    return this.firestore.collection('turnos').doc(id).update({
      encuestaCompletada: true,
      encuesta: encuesta
    });
  }

  calificarAtencion(id: string, calificacion: string): Promise<void> {
    return this.firestore.collection('turnos').doc(id).update({
      calificacionCompletada: true,
      calificacion: calificacion
    });
  }

  rechazarTurno(id: string, comentario: string): Promise<void> {
    const docRef = this.firestore.collection('turnos').doc(id);
    return docRef.get().toPromise().then(docSnapshot => {
      if (docSnapshot.exists) {
        return docRef.update({
          estado: 'cancelado',
          comentarioCancelacion: comentario
        });
      } else {
        return Promise.reject(new Error('El documento no existe'));
      }
    });
  }
  
  
  aceptarTurno(id: string): Promise<void> {
    return this.firestore.collection('turnos').doc(id).update({
      estado: 'aceptado'
    });
  }

  finalizarTurno(id: string, resenia: string): Promise<void> {
    return this.firestore.collection('turnos').doc(id).update({
      estado: 'realizado',
      resenia: resenia
    });
  }

  getTurnos(): Observable<Turno[]> {
    return this.firestore.collection<Turno>('turnos').valueChanges();
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

  agregarResenia(id: string, resenia: string): Promise<void> {
    return this.firestore.collection('turnos').doc(id).update({
      resenia: resenia
    });
  }
}