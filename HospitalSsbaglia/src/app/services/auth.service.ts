import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,UserCredential, GoogleAuthProvider, User} from 'firebase/auth'; 
import { Usuario } from '../clases/usuario';
import { Observable, of } from 'rxjs';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import firebase from 'firebase/compat/app';
import { switchMap, map, tap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
 
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private PATH = 'Usuarios';
  private items$: Observable<Usuario[]>;
  public loguado: boolean = false;
  public esAdmin: boolean = false;
  constructor(
    public auth: AngularFireAuth,
    public firestore: AngularFirestore,
    public db: AngularFireDatabase,
    public storage: AngularFireStorage
  ) {
    this.items$ = this.db.list(this.PATH).valueChanges() as Observable<Usuario[]>;
  }

  public getAll() {
    return this.items$;
  }

 
  async registrar(usuario: Usuario): Promise<void> {
    const { mail, contraseña, imagenes } = usuario;
    const userCredential = await this.auth.createUserWithEmailAndPassword(mail, contraseña);
    const userId = userCredential.user?.uid;
  
    if (userId) {
      const imagenesArray = Array.isArray(imagenes) ? imagenes : [imagenes];
      const imagenesURLs = await this.uploadImages(imagenesArray, userId);
  
      await this.firestore.collection(this.PATH).doc(userId).set({
        ...usuario,
        uid: userId,
        imagenes: imagenesURLs
      });
    }
}



  private async uploadImages(imagenes: File[], userId: string): Promise<string[]> {
    const uploadPromises = imagenes.map((imagen, index) => {
      const filePath = `users/${userId}/profile_${index}`;
      return this.storage.upload(filePath, imagen).then(() => {
        return this.storage.ref(filePath).getDownloadURL().toPromise();
      });
    });
    return Promise.all(uploadPromises);
  }
  

  async login(mail: string, pass: string) {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(mail, pass);
      await this.updateLastLogin(userCredential.user.uid);
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      throw error;
    }
  }


  async loginWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const userCredential = await this.auth.signInWithPopup(provider);
      await this.updateLastLogin(userCredential.user?.uid!);
    } catch (error) {
      console.error('Error de inicio de sesión con Google:', error);
      throw error;
    }
  }

  private async updateLastLogin(uid: string) {
    const now = new Date();
    await this.firestore.collection(this.PATH).doc(uid).update({
      lastLogin: now
    });
  }

  public async guardarUsuarioFirestore(
    uid: string, 
    nombre: string, 
    mail: string, 
    apellido: string, 
    dni: string, 
    obraSocial: string | null, 
    especialidad: string[], 
    contraseña: string, 
    imagenes: File[], 
    aprobado: boolean | null,
    esAdmin: boolean = false  
): Promise<void> {
    await this.firestore.collection(this.PATH).doc(uid).set({
        nombre,
        apellido,
        dni,
        obraSocial,
        especialidad,  
        mail,
        imagenes,
        aprobado,
        esAdmin,  
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    });
}

  // public async guardarUsuarioFirestore(uid: string, nombre: string, email: string) {
  //   await this.firestore.collection(this.PATH).doc(uid).set({
  //     nombre,
  //     email,
  //     lastLogin: firebase.firestore.FieldValue.serverTimestamp()
  //   });
  // }

  async logout() {
    try {
      await this.auth.signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  estaLogueado() {
    return this.auth.currentUser !== null;
  }

  usuarioActual(): Promise<Usuario> {
    return new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          this.firestore.collection(this.PATH).doc(user.uid).valueChanges().subscribe((usuario: any) => {
            if (usuario) {
              usuario.lastLogin = usuario.lastLogin ? usuario.lastLogin.toDate() : null;
              resolve(new Usuario(usuario.nombre, usuario.apellido, usuario.dni, usuario.edad, usuario.obraSocial, usuario.especialidad, '', usuario.mail, usuario.imagenes, usuario.code, usuario.lastLogin));
            } else {
              reject('No se encontró el usuario en la base de datos');
            }
          }, error => reject(error));
        } else {
          reject('No hay un usuario logueado');
        }
      });
    });
  }

  getCurrentUser(): Observable<firebase.User | null> {
    return this.auth.authState;
  }

  getCurrentUserName(): Observable<string | null> {
    return this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection(this.PATH).doc(user.uid).valueChanges().pipe(
            switchMap((userDoc: any) => of(userDoc?.nombre || null))
          );
        } else {
          return of(null);
        }
      })
    );
  }

  async verificarMensajeExistenteAlIniciarSesion(): Promise<void> {
    const user = firebase.auth().currentUser;
    if (!user) {
      console.error('Usuario no autenticado al verificar el mensaje existente al iniciar sesión');
      return;
    }

    const snapshot = await this.firestore.collection('messages').ref
      .where('userEmail', '==', user.email)
      .get();

    if (snapshot.empty) {
      console.log('No hay mensajes existentes para este usuario al iniciar sesión');
      return;
    }

    const batch = this.firestore.firestore.batch();
    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log('Mensajes existentes eliminados para este usuario al iniciar sesión');
  }

  public getAllUsers(): Observable<Usuario[]> {
    return this.firestore.collection(this.PATH).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        return new Usuario(data.nombre, data.apellido, data.dni, data.edad, data.obraSocial, data.especialidad, '', data.mail, data.imagenes, data.code, data.lastLogin ? data.lastLogin.toDate() : null);
      }))
    );
  }

  public obtenerSolicitudesEspecialistas(): Observable<Usuario[]> {
    return this.firestore.collection(this.PATH, ref => ref.where('especialidad', '!=', null).where('aprobado', '==', false)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        return new Usuario(
          data.nombre, data.apellido, data.dni, data.edad,
          data.obraSocial, data.especialidad, '', data.mail, data.imagenes, data.code, data.lastLogin ? data.lastLogin.toDate() : null
        );
      }))
    );
  }

  public async aceptarEspecialista(uid: string): Promise<void> {
    await this.firestore.collection(this.PATH).doc(uid).update({ aprobado: true });
  }

  
  async cambiarEstadoAdmin(mail: string, esAdmin: boolean): Promise<void> {
    try {
      const snapshot = await this.firestore.collection(this.PATH).ref.where('mail', '==', mail).get();
      if (snapshot.empty) {
        throw new Error('No se encontró el usuario con el email proporcionado');
      }
      const doc = snapshot.docs[0];
      await doc.ref.update({ esAdmin });
    } catch (error) {
      console.error('Error al cambiar estado de admin:', error);
      throw error;
    }
  }

 

}