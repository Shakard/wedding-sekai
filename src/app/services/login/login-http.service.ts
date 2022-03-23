import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginHttpService {
  url = environment.URL_API_REMOTE;  

  constructor(private httpClient: HttpClient) { }

  get(params = new HttpParams()) {
    const url = this.url + 'units';
  }

  logout() {
    const url = this.url + 'logout';
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + token
      }
    );
    return this.httpClient.get(url, { headers: headers });
  }

  login(userCredentials: any, params = new HttpParams()) {
    const url = this.url + 'login';
    const credentials = {
      email: userCredentials.email,
      password: userCredentials.password
    };
    return this.httpClient.post(url, credentials, { params });
  }

  public isAuthenticated(): boolean {    
    const token = localStorage.getItem('token');   
    if (!token) {
      return false;
    }
    return true;
  }

}
