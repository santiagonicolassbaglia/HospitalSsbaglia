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
import { HistoriaClinica } from '../clases/historia-clinica';
 
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  private PATH = 'Usuarios';
  private items$: Observable<Usuario[]>;
  public loguado: boolean = false;
  public esAdmin: boolean = false;
  userType: string = '';
  constructor(
    public auth: AngularFireAuth,
    public firestore: AngularFirestore,
    public db: AngularFireDatabase,
    public storage: AngularFireStorage
  ) {
    this.items$ = this.db.list(this.PATH).valueChanges() as Observable<Usuario[]>;
  }

  public getAll(): Observable<Usuario[]> {
    return this.firestore.collection(this.PATH).snapshotChanges().pipe(
      map(actions => {
        console.log('Acciones Firestore:', actions); // Depuración
        return actions.map(a => {
          const data = a.payload.doc.data() as Usuario;
          const id = a.payload.doc.id;
          return { id, ...data } as Usuario;
        });
      })
    );
  }
  
 
  async registrar(usuario: Usuario): Promise<void> {
    const { mail, contraseña, imagenes } = usuario;
    const userCredential = await this.auth.createUserWithEmailAndPassword(mail, contraseña);
    const userId = userCredential.user?.uid;
  
    if (userId) {
      const imagenesArray = Array.isArray(imagenes) ? imagenes : [imagenes];
      const imagenesURLs = await this.uploadImages(imagenesArray as File[], userId);
  
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
    const userDoc = await this.firestore.collection(this.PATH).doc(userCredential.user.uid).get().toPromise();
    const userData = userDoc.data() as Usuario;

    if (userData) {
      // Verificar si el usuario es un especialista y si está aprobado
      if (userData.especialidad.length > 0 && !userData.aprobado) {
        throw new Error('El especialista no ha sido aprobado.');
      }

      this.loguado = true;
      this.esAdmin = userData.esAdmin;
      localStorage.setItem('dni', userData.dni);
      await this.updateLastLogin(userCredential.user.uid);
    }
  } catch (error) {
    let errorMessage: string;
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No se encontró un usuario con ese correo.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Contraseña incorrecta.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Demasiados intentos fallidos. Intenta más tarde.';
        break;
      default:
        errorMessage = error.message || 'Error desconocido al iniciar sesión.';
    }
    console.error('Error de inicio de sesión:', error);
    throw new Error(errorMessage);
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

  private async updateLastLogin(uid: string): Promise<void> {
    await this.firestore.collection(this.PATH).doc(uid).update({
      lastLogin: new Date()
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
              resolve(new Usuario(
                user.uid, // Pasar el uid del usuario
                usuario.nombre,
                usuario.apellido,
                usuario.dni,
                usuario.edad,
                usuario.obraSocial,
                usuario.especialidad,
                '', // Contraseña vacía, ya que no debería obtenerse desde Firestore
                usuario.mail,
                usuario.imagenes,
                usuario.code,
                usuario.lastLogin,
                usuario.esAdmin,
                usuario.aprobado
              ));
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
  
  getUserById(uid: string): Observable<Usuario> {
    return this.firestore.collection('usuarios').doc<Usuario>(uid).valueChanges();
  }
  getCurrentUser(): Observable<Usuario | null> {
    return this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection<Usuario>('Usuarios').doc(user.uid).valueChanges();
        } else {
          return of(null);
        }
      })
    );
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
        const id = a.payload.doc.id; // Obtener el ID del documento
        return new Usuario(
          id, // Pasar el ID como uid
          data.nombre,
          data.apellido,
          data.dni,
          data.edad,
          data.obraSocial,
          data.especialidad,
          data.contraseña,
          data.mail,
          data.imagenes,
          data.code,
          data.lastLogin ? data.lastLogin.toDate() : null,
          data.esAdmin,
          data.aprobado
        );
      }))
    );
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

  async eliminarUsuario(uid: string): Promise<void> {
    try {
      // Elimina el usuario de Firestore
      await this.firestore.collection(this.PATH).doc(uid).delete();
      // Elimina el usuario de Firebase Auth
      const user = await this.auth.currentUser;
      if (user && user.uid === uid) {
        await user.delete();
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      throw error;
    }
  }


 
  public async registrarEspecialista(usuario: Usuario): Promise<void> {
    const { mail, contraseña, imagenes } = usuario;
  
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(mail, contraseña);
      
      if (userCredential && userCredential.user) {
        const userId = userCredential.user.uid;
        let imagenesURLs: string[] = [];
  
        if (imagenes && imagenes.length > 0 && imagenes[0] instanceof File) {
          imagenesURLs = await this.uploadImages(imagenes as File[], userId);
        }
  
        usuario.uid = userId;
        usuario.imagenes = imagenesURLs; // URLs de las imágenes
        usuario.aprobado = false; // Set approved to false initially
  
        // Guardar usuario en Firestore y en la colección de solicitudes de especialistas
        await Promise.all([
          this.firestore.collection(this.PATH).doc(userId).set({ ...usuario }),
          this.firestore.collection('specialistRequests').doc(userId).set({ ...usuario })
        ]);
  
        console.log('Especialista registrado correctamente:', usuario);
      } else {
        throw new Error('No se pudo crear el usuario correctamente.');
      }
    } catch (error) {
      console.error('Error al registrar especialista:', error);
      throw error; // Re-lanza el error para manejarlo en el componente que llama a este método
    }
  }
  



  // Method to accept specialist request
  public async aceptarEspecialista(uid: string): Promise<void> {
    await this.firestore.collection(this.PATH).doc(uid).update({ aprobado: true });
    await this.firestore.collection('specialistRequests').doc(uid).delete();
  }

  // Method to get all specialist requests
  public obtenerSolicitudesEspecialistas(): Observable<Usuario[]> {
    return this.firestore.collection('specialistRequests').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        return new Usuario(
          data.uid,
          data.nombre,
          data.apellido,
          data.dni,
          data.edad,
          data.obraSocial,
          data.especialidad,
          '',
          data.mail,
          data.imagenes,
          data.code,
          data.lastLogin ? data.lastLogin.toDate() : null,
          data.aprobado
        );
      }))
    );
  }

  rechazarEspecialista(uid: string): Promise<void> {
    return this.firestore.collection('specialistRequests').doc(uid).delete();
  }


  getUserByDNI(dni: string): Observable<Usuario[]> {
    return this.firestore.collection(this.PATH, ref => ref.where('dni', '==', dni)).valueChanges().pipe(
      map((usuarios: any[]) => {
        return usuarios.map(usuario => {
          return new Usuario(
            usuario.uid,
            usuario.nombre,
            usuario.apellido,
            usuario.dni,
            usuario.edad,
            usuario.obraSocial,
            usuario.especialidad,
            usuario.contraseña,
            usuario.mail,
            usuario.imagenes,
            usuario.code,
            usuario.lastLogin ? usuario.lastLogin.toDate() : null,
            usuario.esAdmin,
            usuario.aprobado
          );
        });
      })
    );
  }

 

  async getCurrentUserDni(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged(async (user) => {
        if (user) {
          const userDoc = await this.firestore.collection(this.PATH).doc(user.uid).get().toPromise();
          const userData = userDoc?.data() as Usuario;
          if (userData && userData.dni) {
            resolve(userData.dni);
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    });
  } 


 
  public obtenerEspecialidades(): Observable<string[]> {
    return this.firestore.collection<Usuario>(this.PATH).valueChanges().pipe(
      map(usuarios => {
        const especialidades: string[] = [];
        usuarios.forEach(usuario => {
          usuario.especialidad.forEach(especialidad => {
            if (!especialidades.includes(especialidad)) {
              especialidades.push(especialidad);
            }
          });
        });
        return especialidades;
      })
    );
  }

 
  public getUsuariosByEspecialidad(especialidad: string): Observable<Usuario[]> {
    return this.firestore.collection<Usuario>(this.PATH, ref => ref.where('especialidad', 'array-contains', especialidad)).valueChanges();
  }
 
  public obtenerTurnosDisponibles(uid: string): Observable<{ fecha: string, hora: string }[]> {
    return this.firestore.collection(`Turnos/${uid}/Disponibles`).valueChanges() as Observable<{ fecha: string, hora: string }[]>;
  }



  public reservarTurno(uid: string, fecha: string, hora: string, paciente: Usuario): Promise<void> {
    return this.firestore.collection(`Turnos/${uid}/Reservados`).doc(`${fecha} ${hora}`).set(paciente);
  }

  getLogIngresos(): Observable<any[]> {
    return this.firestore.collection('Logs', ref => ref.orderBy('timestamp')).valueChanges();
  }

  filtrarHistoriasClinicasPorEspecialidad = (historiasClinicas: HistoriaClinica[], especialidad: string): HistoriaClinica[] => {
    
    this.userType = 'especialista';
    return historiasClinicas.filter(historiaClinica => historiaClinica.especialidad === especialidad);

    
  }



}
 