import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { isLoading, stopLoading } from '../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnDestroy {

  ingresoForm: FormGroup;
  tipo: string;
  cargado: boolean;
  uiSubscription: Subscription;

  constructor(private formBuilder: FormBuilder, private IngresoEgresoService: IngresoEgresoService, private store:Store<AppState>) {
    this.ingresoForm = this.formBuilder.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    })
    this.tipo = 'ingreso';
    this.uiSubscription = this.store.select('ui').subscribe(ui => this.cargado = ui.isLoading);
   }


  guardar() {
    if(this.ingresoForm.valid){
      this.store.dispatch(isLoading());

      const { descripcion, monto } = this.ingresoForm.value;
      const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);

      this.IngresoEgresoService.crearIngresoEgreso(ingresoEgreso)
      .then( () => {
        Swal.fire('RegistroCreado', descripcion, 'success'),
        this.store.dispatch(stopLoading());
      })
      .catch( err => {
        Swal.fire('Error', err, 'error'),
        this.store.dispatch(stopLoading())
      });
    }
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

}
