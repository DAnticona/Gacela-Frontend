import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ParamsService {

  configUrl = 'assets/config.json';
  urls: any;
  conexion: any;
  usuario: any;
  perfil: any;
  menus: any[] = [];


  constructor(private http: HttpClient) {

    this.cargarStorage();

  }

  getUrls() {

    return this.http.get(this.configUrl);

  }


  getLogin(login: any, urls: any) {

    // console.log(login);

    const httpOptions = {

      headers: new HttpHeaders({
        Authorization: 'basic ' + btoa(`${login.noUsua}:${login.paUsua}`),
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };

    return this.http.post(urls.loginUrl, '', httpOptions);

  }


  getLogout(noUsua: string) {


    // let noUsua = this.configService.getUsuario();
    let token = this.conexion.token;

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      
      observe: 'response' as 'body',

      params: new HttpParams()
        .set('usuario', noUsua)
    };

    this.removeAllData();

    return this.http.get(this.urls.logoutUrl, httpOptions);
  }

  removeAllData() {

    localStorage.clear();

  }


  cargarStorage() {

    if (localStorage.getItem('urls')) {

      this.urls = JSON.parse(localStorage.getItem('urls'));

    } else {

      this.urls = '';

    }

    if (localStorage.getItem('conexion')) {

      this.conexion = JSON.parse(localStorage.getItem('conexion'));

    } else {

      this.conexion = '';

    }

    if (localStorage.getItem('usuario')) {

      this.usuario = JSON.parse(localStorage.getItem('usuario'));

    } else {

      this.usuario = '';

    }

    if (localStorage.getItem('perfil')) {

      this.perfil = JSON.parse(localStorage.getItem('perfil'));

    } else {

      this.perfil = '';

    }

    if (localStorage.getItem('menus')) {

      this.menus = JSON.parse(localStorage.getItem('menus'));

    } else {

      this.menus = [];

    }

  }

  guardarUrls(urls: any) {

    this.urls = urls;

    localStorage.setItem('urls', JSON.stringify(this.urls));

  }

  guardarConexion(conexion: any) {

    this.conexion = conexion;

    localStorage.setItem('conexion', JSON.stringify(this.conexion));

  }


  guardarUsuario(usuario: any) {

    this.usuario = usuario;

    localStorage.setItem('usuario', JSON.stringify(this.usuario));

  }


  guardarPerfil(perfil: any) {

    this.perfil = perfil;

    localStorage.setItem('perfil', JSON.stringify(this.perfil));

  }


  guardarMenus(menus: any) {

    this.menus = menus;

    localStorage.setItem('menus', JSON.stringify(this.menus));

  }
}
