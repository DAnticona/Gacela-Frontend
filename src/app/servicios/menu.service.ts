import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  urls: any;
  menus: any[] = [];

  constructor(private http: HttpClient,
    private config: ConfigService) {

    this.cargarStorage();

    this.config.getUrls()
    .subscribe(res => {
      this.urls = res;
    });

  }



  getMenusXPerfil(coPerf: string, token: string) {

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body',
      params: new HttpParams().set('perfil', coPerf)
    };

    return this.http.get(this.urls.menuXPerfilUrl, httpOptions);
  }


  guardarMenus(menus: any) {

    this.menus = menus;

    localStorage.setItem('menus', JSON.stringify(this.menus));

  }


  cargarStorage() {

    if (localStorage.getItem('menus')) {

      this.menus = JSON.parse(localStorage.getItem('menus'));

    } else {

      this.menus = [];

    }
  }
}
