import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, map, tap } from 'rxjs';
import { Turno } from '../clases/turno';
import { DocumentReference } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private turnosCollection: AngularFirestoreCollection<Turno>;
  private PATH = 'turnos';

  constructor(private firestore: AngularFirestore) {
    this.turnosCollection = this.firestore.collection<Turno>('turnos');
  }
  async eliminarTurno(id: string): Promise<void> {
    const docRef = this.firestore.collection(this.PATH).doc(id);

    try {
      const docSnapshot = await docRef.get().toPromise();
      if (!docSnapshot.exists) {
        throw new Error(`No se encontró el turno con el ID proporcionado: ${id}`);
      }

      await docRef.delete();
      console.log('Turno eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar el turno:', error);
      throw error; // Propaga el error para manejarlo en el componente
    }
  }
  getTurnosByPaciente(pacienteId: string): Observable<Turno[]> {
    console.log('Buscando turnos para paciente ID:', pacienteId);  // Log del ID del paciente
    return this.firestore.collection<Turno>('turnos', ref => ref.where('paciente', '==', pacienteId)).valueChanges().pipe(
      tap(turnos => console.log('Turnos encontrados:', turnos))  // Log de los turnos encontrados
    );
  }
  

  getTurnosByEspecialista(especialistaId: string): Observable<Turno[]> {
    return this.firestore.collection<Turno>('turnos', ref => ref.where('especialista', '==', especialistaId)).valueChanges();
  }


  getTurnoById(id: string): Observable<Turno> {
    return this.firestore.collection(this.PATH).doc(id).valueChanges().pipe(
      map((turno: any) => {
        if (turno) {
          return new Turno(
            id,
            turno.especialidad,
            turno.especialista,
            turno.fecha.toDate(), // convertir Firestore Timestamp a Date
            turno.estado,
            turno.paciente,
            turno.resenia,
            turno.encuestaCompletada,
            turno.calificacionCompletada,
            turno.comentario
          );
        } else {
          throw new Error('No se encontró el turno con el ID proporcionado');
        }
      })
    );
  }

  async rechazarTurno(id: string, comentario: string): Promise<void> {
    const docRef = this.firestore.collection(this.PATH).doc(id);

    try {
      const docSnapshot = await docRef.get().toPromise();
      if (!docSnapshot.exists) {
        throw new Error(`No se encontró el turno con el ID proporcionado: ${id}`);
      }

      if (comentario.toLowerCase() === 'cancelar') {
        await docRef.delete();
        console.log('Turno eliminado exitosamente');
      } else {
        await docRef.update({
          estado: 'cancelado',
          comentarioCancelacion: comentario
        });
        console.log('Turno cancelado exitosamente');
      }
    } catch (error) {
      console.error('Error al procesar el turno:', error);
      throw error; // Propaga el error para manejarlo en el componente
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


  async eliminarTurnoPorEspecialistaYFecha(especialista: string, fecha: Date): Promise<void> {
    const collectionRef = this.firestore.collection(this.PATH, ref =>
      ref.where('especialista', '==', especialista).where('fecha', '==', fecha)
    );

    try {
      const querySnapshot = await collectionRef.get().toPromise();
      if (querySnapshot.empty) {
        throw new Error(`No se encontró el turno con el especialista proporcionado: ${especialista} y fecha: ${fecha}`);
      }

      querySnapshot.forEach(doc => {
        doc.ref.delete();
      });
      console.log('Turno eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar el turno:', error);
      throw error; // Propaga el error para manejarlo en el componente
    }
  }

}