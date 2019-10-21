import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  constructor(private http: HttpClient) { }

  changePassword(token: string, forma: any, urls: any) {

    const httpOptions = {

      headers: new HttpHeaders({
        Authorization: 'basic ' + btoa(`${forma.noUsua}:${forma.paUsua}`),
        token: `${token}`,
        newPassword: 'basic ' + btoa(`${forma.password1}`),
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };

    return this.http.post(urls.cambioPasswordUrl, forma, httpOptions);


  }

  regeneratePassword() {

  }
}
