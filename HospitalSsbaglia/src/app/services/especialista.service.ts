// especialista.service.ts

import { Injectable } from '@angular/core';
 
import { Observable } from 'rxjs';
 
import { Disponibilidad, Especialista } from '../Interfaces/especialista';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class EspecialistaService {
  private coleccionEspecialistas = 'especialistas';

  constructor(private firestore: AngularFirestore) {}

  getEspecialista(uid: string): Observable<Especialista | undefined> {
    return this.firestore.doc<Especialista>(`${this.coleccionEspecialistas}/${uid}`).valueChanges();
  }

  actualizarEspecialista(especialista: Especialista): Promise<void> {
    return this.firestore.doc(`${this.coleccionEspecialistas}/${especialista.uid}`).update(especialista);
  }

  // getDisponibilidad(uid: string): Observable<Disponibilidad[]> {
  //   return this.firestore.collection<Disponibilidad>(`${this.coleccionEspecialistas}/${uid}/disponibilidad`).valueChanges();
  // }

  actualizarDisponibilidad(uid: string, disponibilidad: Disponibilidad[]): Promise<void> {
    return this.firestore.doc(`${this.coleccionEspecialistas}/${uid}`).update({ disponibilidadHoraria: disponibilidad });
  }
  getDisponibilidad(uid: string): Observable<Disponibilidad[]> {
    return this.firestore.collection('especialistas').doc(uid).collection<Disponibilidad>('disponibilidad').valueChanges();
  }

  guardarDisponibilidad(uid: string, disponibilidad: Disponibilidad[]): Promise<void> {
    const disponibilidadRef = this.firestore.collection('especialistas').doc(uid).collection('disponibilidad');
    return this.firestore.firestore.runTransaction(async transaction => {
      const snapshot = await disponibilidadRef.get().toPromise();
      snapshot.forEach(doc => transaction.delete(doc.ref));
      disponibilidad.forEach(dia => {
        disponibilidadRef.doc(dia.dia).set(dia);
      });
    });
  }

  
}
