import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  configUrl = 'assets/config.json';
  urls: any;
  token: string;
  usuario: any;
  persona: any;
  perfil: any;
  menus: any;
  conexion: any;

  constructor(private http: HttpClient) {

    this.cargarStorage();

  }


  getUrls() {

    return this.http.get(this.configUrl);
    
  }

  cargarStorage() {

    if(localStorage.getItem('urls')) {

      this.urls = JSON.parse(localStorage.getItem('urls'));

    } else {

      this.urls = '';

    }
    
  }


  guardarUrls(urls: any) {

    this.urls = urls;

    localStorage.setItem('urls', JSON.stringify(this.urls));

  }



  removeAllData() {

    if(localStorage.getItem('token')) {

      localStorage.removeItem('token');

    } 

    if(localStorage.getItem('usuario')) {

      localStorage.removeItem('usuario');

    } 

    if(localStorage.getItem('urls')) {

      localStorage.removeItem('urls');

    }

    if(localStorage.getItem('conexion')) {

      localStorage.removeItem('conexion');

    }

    if(localStorage.getItem('menus')) {

      localStorage.removeItem('menus');

    }

    if(localStorage.getItem('perfil')) {

      localStorage.removeItem('perfil');

    }
  }
}
