import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppComponent } from './app.component';
import { AppMainComponent } from './app.main.component';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { User } from './models/auth/user';
import { Router } from '@angular/router';
import { LoginComponent } from './public/login/login.component';
import { LoginHttpService } from './services/login/login-http.service';
import { UserService } from './services/user/user.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnDestroy, OnInit {

    subscription: Subscription;
    loggedIn;
    items: MenuItem[];
    user: User;

    constructor(public app: AppComponent, public appMain: AppMainComponent,
        private loginComponent: LoginComponent,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.getLoggedUser();                
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public getLoggedUser(){     
        this.userService.getLoggedUser().subscribe(response => {
          this.user = response['data']
        });
      }

    logout(): void {
        console.log(localStorage.getItem('token')); 
        this.loginComponent.logout();
    }
}

