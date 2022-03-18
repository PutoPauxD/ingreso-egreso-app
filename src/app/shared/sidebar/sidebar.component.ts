import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Usuario } from '../../models/usuario.model';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombre: string;
  userSubs: Subscription;

  constructor(private authService: AuthService, private store: Store<AppState>) {
    this.userSubs = this.store.select('auth').pipe(filter(({user}) => user!== null))
                    .subscribe(({user}) => this.nombre = user.nombre);
  } 

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }

}
