import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

//NgRx
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroFrom: FormGroup;
  uiSubscription: Subscription;
  cargando: boolean;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private store: Store<AppState>) { 
    this.registroFrom = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.cargando = false;
  }

  ngOnInit(): void {
    this.uiSubscription = this.store.select('ui').subscribe(ui=>(this.cargando = ui.isLoading));
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  crearUsuario() {
    if (this.registroFrom.valid) {
      // Swal.fire({
      //   title: 'Por favor espere!',
      //   didOpen: () => {Swal.showLoading()}
      // })
      this.store.dispatch(ui.isLoading());

      const {nombre, correo, password} = this.registroFrom.value;
      this.authService.createUsuario(nombre, correo, password)
      .then(credenciales => {

        console.log(credenciales);
        // Swal.close();
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/']);
      
      })
      .catch(err=> {
        
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        })      
      })    
    }
  }

}
