import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/auth/user';
import { LoginHttpService } from './login-http.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardGuard implements CanActivate {
  loggedUser: User;
  
  constructor(public loginHttpService: LoginHttpService, public router: Router) {}

  async canActivate(): Promise<boolean> {
    const res = await this.loginHttpService.getLoggedUser().toPromise();     
    this.loggedUser = res['data'];    
    if (this.loggedUser.roles[0]?.name != 'Admin') {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
  
}
