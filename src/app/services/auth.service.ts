import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth:AngularFireAuth, private router:Router, private firestore:AngularFirestore) { }

  initAuthListener() {
    this.auth.authState.subscribe( fuser => {console.log(fuser)});
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
