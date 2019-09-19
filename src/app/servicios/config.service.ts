import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  configUrl = 'assets/config.json';
  config: any;
  token: string;
  usuario: any;

  constructor(private http: HttpClient) {

    this.cargarStorage();

  }


  getInitConfig() {

    return this.http.get(this.configUrl);
    
  }

  getUsuario(): any {

    return this.usuario;

  }

  getToken(): string {

    return this.token;

  }

  getConfig() {

    return this.config;

  }

  cargarStorage() {

    if(localStorage.getItem('token')) {

      this.token = JSON.parse(localStorage.getItem('token'));

    } else {

      this.token = '';

    }

    if(localStorage.getItem('usuario')) {

      this.usuario = JSON.parse(localStorage.getItem('usuario'));

    } else {

      this.usuario = '';

    }

    if(localStorage.getItem('config')) {

      this.config = JSON.parse(localStorage.getItem('config'));

    } else {

      this.config = '';

    }
    

  }


  guardarToken(token: string) {

    this.token = token;

    localStorage.setItem('token', JSON.stringify(this.token));

  }

  guardarUsuario(usuario: any) {

    this.usuario = usuario;

    localStorage.setItem('usuario', JSON.stringify(this.usuario));

  }


  guardarConfig(config: any) {

    this.config = config;

    localStorage.setItem('config', JSON.stringify(this.config));

  }



  removeAllData() {

    if(localStorage.getItem('token')) {

      localStorage.removeItem('token');

    } 

    if(localStorage.getItem('usuario')) {

      localStorage.removeItem('usuario');

    } 

    if(localStorage.getItem('config')) {

      localStorage.removeItem('config');

    }
  }
}
