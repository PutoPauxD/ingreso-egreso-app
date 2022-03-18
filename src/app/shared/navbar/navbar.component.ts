import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {

  usernombre: string;
  userSubscription: Subscription;

  constructor(private store:Store<AppState>) { 
    this.userSubscription = this.store.select('auth').pipe(filter(({user}) => user !== null))
                            .subscribe( ({user}) => this.usernombre = user.nombre);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}
