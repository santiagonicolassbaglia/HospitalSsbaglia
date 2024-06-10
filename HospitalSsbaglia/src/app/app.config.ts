import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../assets/environments/environment.prod';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { provideAuth } from '@angular/fire/auth';
import { initializeApp } from 'firebase/app';
import { provideFirebaseApp } from '@angular/fire/app';
import { getStorage } from 'firebase/storage';
import { provideStorage } from '@angular/fire/storage';
import { provideDatabase } from '@angular/fire/database';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { provideFirestore } from '@angular/fire/firestore';
import { getAuth } from 'firebase/auth';
import { SpinnerInterceptor } from './shared/spinner.interceptor';



export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),

    provideHttpClient(),
    importProvidersFrom(
      AngularFireModule.initializeApp(environment.firebaseConfig)), 
       AngularFirestoreModule, 
      
    provideAuth(() => getAuth()),

    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()), provideFirebaseApp(() => initializeApp( environment.firebaseConfig)),

  ]
 
};
