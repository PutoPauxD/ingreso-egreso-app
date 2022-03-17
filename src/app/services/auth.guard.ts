import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService:AuthService, private router: Router){}
  
  canActivate(): Observable<any> {
    return this.authService.isAuth().pipe(
      tap(estado => {
        console.log(estado);
        if (!estado) {this.router.navigate(['/login']); console.log("deniengo acceso")}
      })
    );

  }
  
}
