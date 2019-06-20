import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from '../interfaces/config';
import { Login } from '../clases/login';
import { Usuario } from '../clases/usuario';

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
    'Content-Type':	'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  configUrl = '../assets/config.json';

  getConfig() {
    return this.http.get<Config>(this.configUrl);
  }

  login(login: Login, config: Config): Observable<Usuario>{

    return this.http.post<Usuario>(config.loginUrl, login, httpOptions);

  }

}