import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppComponent } from './app.component';
import { AppMainComponent } from './app.main.component';
import { delay, firstValueFrom, Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { User } from './models/auth/user';
import { Router } from '@angular/router';
import { LoginComponent } from './public/login/login.component';
import { LoginHttpService } from './services/login/login-http.service';
import { UserService } from './services/user/user.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnDestroy, OnInit {

    subscription: Subscription;
    loggedIn: any;
    items: MenuItem[];
    loggedUser: User;

    constructor(public app: AppComponent, public appMain: AppMainComponent,
        private loginComponent: LoginComponent,
        private userService: UserService,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit(): void {
           this.getLoggedUser();
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    // public getLoggedUser() {
    //     this.spinner.show();
    //     firstValueFrom(this.userService.getLoggedUser()).then(response => {
    //         this.loggedUser = response['data']
    //         this.spinner.hide();
    //     });
    // }

    public getLoggedUser() {
        this.userService.getLoggedUser().subscribe(response => {
          this.loggedUser = response['data']
        });
      }

    logout(): void {
        this.loginComponent.logout();
    }
}

