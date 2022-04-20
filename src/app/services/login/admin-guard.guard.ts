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

  canActivate(): boolean {
    // this.loginHttpService.getLoggedUser().subscribe({
    //   next: (response) => this.loggedUser = response['data'],        
    //   // next: () => this.messageService.successConfirmation(),
    //   // error: (response) => this.messageService.errorUploadFile(response.error.errors.image),
    //   complete: () => console.log(this.loggedUser)
    // });      

    // console.log(this.loggedUser);
    
    // // if (this.loggedUser.roles[0].name != 'Admin') {
    // //   this.router.navigate(['']);
    // //   console.log('false');   
    // //   return false;
    // // }
    // // console.log('true');
    return false;
  }
  
}
