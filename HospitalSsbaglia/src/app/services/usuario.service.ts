import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Usuario } from '../clases/usuario';
import { HistoriaClinica } from '../clases/historia-clinica';



@Injectable({
  providedIn: 'root'
})


export class UsuarioService {

  
  private usuariosCollection = 'Usuarios'; // Nombre de la colección en Firestore

  constructor(private firestore: AngularFirestore) {}

  getUsuario(uid: string): Observable<Usuario | undefined> {
    return this.firestore.collection<Usuario>(this.usuariosCollection).doc(uid).valueChanges();
  }

  actualizarUsuario(usuario: Usuario): Promise<void> {
    const userRef = this.firestore.collection(this.usuariosCollection).doc(usuario.uid);
    return userRef.update(usuario);
  }
  filtrarHistoriasClinicasPorEspecialidad = (historiasClinicas: HistoriaClinica[], especialidad: string): HistoriaClinica[] => {
    return historiasClinicas.filter(historiaClinica => historiaClinica.especialidad === especialidad);
  }

   
}