import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, delay, firstValueFrom, Subject, Subscription, throwError } from 'rxjs';
import { User } from 'src/app/models/auth/user';
import { LoginHttpService } from 'src/app/services/login/login-http.service';
import { NgxSpinnerService } from "ngx-spinner";
import { SweetMessageService } from 'src/app/services/message.service';
import '../../../assets/myJS/test.js'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;
  user: User;
  private loggedChanged = new Subject<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private loginHttpService: LoginHttpService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private messageService: SweetMessageService
  ) { }

  ngOnInit(): void {
    this.buildFormLogin();
  }

  buildFormLogin() {
    this.formLogin = this.formBuilder.group({
      email: [null],
      password: [null],
    });
  }

  get descriptionField() {
    return this.formLogin.get('email');
  }

  get orderField() {
    return this.formLogin.get('password');
  }

  onSubmitLogin(event: Event) {
    event.preventDefault();
    if (this.formLogin.valid) {
      this.login();
    } else {
      this.messageService.badCredentials();
    }
  }

  // login() {
  //   this.spinner.show();
  //   firstValueFrom(this.loginHttpService.login(this.formLogin.value)).then((result: any) => {
  //     localStorage.setItem('token', result.data.token);
  //     this.spinner.hide();
  //     this.router.navigate(['/home']);
  //   });
  // }

  login() {
    this.spinner.show();
    this.loginHttpService.login(this.formLogin.value)
      .subscribe(
        (result: any) => {
          localStorage.setItem('token', result.data.token);
          this.router.navigate(['/wedding-area']);
          this.spinner.hide();
        },
        
        error => {
          this.spinner.hide();
          this.messageService.badCredentials()
        }

      );
  }

  logout() {
    this.spinner.show();
    this.loginHttpService.logout().subscribe(response => {
      localStorage.removeItem('token');
      this.router.navigate(['']);
      this.spinner.hide();
    })
  }



}
