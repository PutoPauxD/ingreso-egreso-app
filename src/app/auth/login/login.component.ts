import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
//NgRx
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando: boolean;
  uiSubscription: Subscription

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private store: Store<AppState>) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })

    this.cargando = false;
   }

  ngOnInit(): void {
    this.uiSubscription = this.store.select('ui').subscribe(ui => this.cargando = ui.isLoading);
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  loginUsuario(){
    if (this.loginForm.valid) {

      this.store.dispatch(ui.isLoading());

      // Swal.fire({
      //   title: 'Por favor espere!',
      //   didOpen: () => {Swal.showLoading()}
      // })
      
      const {email, password} = this.loginForm.value;
      this.authService.loginUsuario(email, password).then( () => {
        // Swal.close();
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/']);
      })
      .catch(err=> {
        this.store.dispatch(ui.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        })      
      })
    }
  }

}
