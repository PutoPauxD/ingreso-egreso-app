import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, take, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService:AuthService, private router: Router){}
  
  canLoad(): Observable<any> {
    return this.authService.isAuth().pipe(
      tap(estado => {
        if (!estado) {this.router.navigate(['/login'])}
      }),
      take(1)
    );
  }
  
  canActivate(): Observable<any> {
    return this.authService.isAuth().pipe(
      tap(estado => {
        if (!estado) {this.router.navigate(['/login'])}
      })
    );
  }
  
}
