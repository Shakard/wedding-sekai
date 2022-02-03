import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginHttpService } from './login-http.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {

  constructor(public loginHttpService: LoginHttpService, public router: Router) {}

  canActivate(): boolean {
    if (!this.loginHttpService.isAuthenticated()) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
  
}
