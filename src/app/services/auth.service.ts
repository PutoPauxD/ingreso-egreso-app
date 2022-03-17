import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import * as authAction from '../auth/auth.actions';
import { unSetUser } from '../auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userSubscription: Subscription;

  constructor(public auth:AngularFireAuth, private router:Router, private firestore:AngularFirestore, private store: Store<AppState>) { }

  initAuthListener() {
    this.auth.authState.subscribe( fuser => {
      if(fuser) {
        this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges().subscribe((firestoreUser:any)=>{
          console.log('Existe fuser')
          const user = Usuario.fromFirebase(firestoreUser);
          this.store.dispatch(authAction.setUser({user}));
        })
      } else {
        this.userSubscription.unsubscribe();
        this.store.dispatch(unSetUser());
        console.log('No existe fuser')
      }
    });
  }

  createUsuario( nombre: string, email: string, password: string) {
    
    return this.auth.createUserWithEmailAndPassword(email, password)
    .then(({user})=> {
      const newUser = new Usuario( user.uid, nombre, user.email);
      
      return this.firestore.doc(`${user.uid}/usuario`).set({...newUser});
    })
    
  }

  loginUsuario(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut()
    .then( () => {
      this.router.navigate(['/login']);
    } );
  }

  isAuth() {
    return this.auth.authState.pipe(map(fuser => fuser !== null));
  }
}
