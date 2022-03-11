import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.URL_API_LOCAL;
  constructor(private httpClient: HttpClient) { }

  getLoggedUser() {
    const url = this.url + 'logged-user';
    const headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    );
    return this.httpClient.get(url, { headers: headers });
  }

  getAllUsers() {
    const url = this.url + 'users';
    const headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    );
    return this.httpClient.get(url, { headers: headers });
  }

  getGuests() {
    const url = this.url + 'guests';
    const headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }  
    );
    return this.httpClient.get(url, { headers: headers });
  }

  getTables() {
    const url = this.url + 'tables';
    const headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }  
    );
    return this.httpClient.get(url, { headers: headers });
  }

  getTablesAndUsers() { 
    const url = this.url + 'tables-users';
    const headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }  
    );
    return this.httpClient.get(url, { headers: headers });
  }

  getCanvasElementWithGuests() { 
    const url = this.url + 'tables-with-guests';
    const headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }  
    );
    return this.httpClient.get(url, { headers: headers });
  }

  getChairs() {
    const url = this.url + 'chairs';
    const headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    );
    return this.httpClient.get(url, { headers: headers });
  }

  getChairsByTableId(tableId: number) {
    const url = this.url + 'chairs-by-table/' + tableId;
    const headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }  
    );
    return this.httpClient.get(url, { headers: headers });
}  


  post(url: string, data: any, params = new HttpParams()) {
    const headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }  
    );
    url = this.url + url;
    return this.httpClient.post(url, data, { params, headers: headers});
  }

  storeUser(url: string, data: any,) {
    const headers = new HttpHeaders().set('Accept', 'application/json');
    url = this.url + url;
    return this.httpClient.post(url, data, { headers: headers });
  }

  store(url: string, data: any, params = new HttpParams()) {
    const headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    );
    url = this.url + url;
    return this.httpClient.post(url, data, { params, headers: headers});
  }

  storeByNumber(url: string) {
    const headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    );
    url = this.url + url;
    return this.httpClient.post(url, {headers: headers});
  }

  clearGuest(url: string) {
    const headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    );
    url = this.url + url;
    return this.httpClient.post(url, {headers: headers});
  }  

  update(url: string, data: any) {
    const headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    );
    url = this.url + url;
    return this.httpClient.put(url, data, { headers: headers });
  }

  delete(url: string) {
    const headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    );
    url = this.url + url;
    return this.httpClient.delete(url, { headers: headers });
  }

  get(url: string) {
    const headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    );
    url = this.url + url;
    return this.httpClient.get(url, { headers: headers });
  }

}