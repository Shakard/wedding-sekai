import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { User } from 'src/app/models/auth/user';
import { LoginHttpService } from 'src/app/services/login/login-http.service';
import { NgxSpinnerService } from "ngx-spinner";

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
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.buildFormLogin();
  }

  buildFormLogin() {
    this.formLogin = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(5)]],
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
      console.log('error');
    }
  }

  login() {
    this.spinner.show();
    this.loginHttpService.login(this.formLogin.value).subscribe(
      (result:any) => {
        localStorage.setItem('token', result.data.token);
        this.router.navigate(['/home']); 
        this.spinner.hide();  
      },
      error => {
        console.log('error');
        console.log(error);
        this.spinner.hide();                
      }
    );
  }

  logout() {
    this.loginHttpService.logout().subscribe(response => {
      localStorage.removeItem('token');
      this.router.navigate(['']);
    })
  }
 
  isUserLoggedIn(): Subject<boolean> {
    return this.loggedChanged;
  }

}
