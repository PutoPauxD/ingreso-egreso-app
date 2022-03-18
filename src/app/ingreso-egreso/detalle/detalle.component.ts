import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import Swal from 'sweetalert2';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnDestroy {

  ingresosEgresos: IngresoEgreso[];
  ingresosSubscription: Subscription;

  constructor(private store:Store<AppStateWithIngreso>, private ingresoEgresoService: IngresoEgresoService) {
    this.ingresosSubscription = this.store.select('ingresoEgreso').subscribe(({items})=>this.ingresosEgresos = items);
  }

  ngOnDestroy(): void {
    this.ingresosSubscription.unsubscribe();
  }
  

  borrar( uid: string){
    console.log(uid);
    this.ingresoEgresoService.borrarIngresoEgreso(uid)
    .then( () => Swal.fire('Borrado.', 'Borrado con exito!', 'success'))
    .catch( (err)=> Swal.fire('Error.', err, 'error'))
  }

}
