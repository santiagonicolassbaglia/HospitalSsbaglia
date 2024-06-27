import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HistoriaClinica } from '../clases/historia-clinica';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoriaClinicaService {
  private collectionName = 'historiasClinicas';

  constructor(private firestore: AngularFirestore) {}
 
  obtenerHistoriasPorEspecialista(especialistaId: string): Observable<any[]> {
    return this.firestore.collection(this.collectionName, ref => ref.where('especialistaId', '==', especialistaId)).snapshotChanges();
  }
  crearHistoriaClinica(historia: HistoriaClinica) {
    return this.firestore.collection('historiasClinicas').add(historia);
  }

  obtenerHistoriasPorPaciente(pacienteId: string) {
    return this.firestore.collection('historiasClinicas', ref => ref.where('pacienteId', '==', pacienteId)).snapshotChanges();
  }
  obtenerTodasHistorias(): Observable<any[]> {
    return this.firestore.collection(this.collectionName).snapshotChanges();
  }

   
  agregarHistoriaClinica(historiaClinica: HistoriaClinica): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection(this.collectionName).doc(id).set({ ...historiaClinica, id });
  }
  // obtenerHistoriasPorEspecialista(especialistaId: string) {
  //   return this.firestore.collection('historiasClinicas', ref => ref.where('especialistaId', '==', especialistaId)).snapshotChanges();
  // }

  // obtenerTodasHistorias() {
  //   return this.firestore.collection('historiasClinicas').snapshotChanges();
  // }
}