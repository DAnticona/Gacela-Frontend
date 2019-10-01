import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  urls: any;
  perfil: any;

  constructor(private http: HttpClient,
              private config: ConfigService) {

    this.cargarStorage();
    
    this.config.getUrls()
      .subscribe(res => {
        this.urls = res;
      });
    

  }


  getPerfil(coUsua: string, token: string) {

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body',
      params: new HttpParams().set('user', coUsua)
    };

    return this.http.get(this.urls.perfilXUsuarioUrl, httpOptions);
  }


  guardarPerfil(perfil: any) {

    this.perfil = perfil;

    localStorage.setItem('perfil', JSON.stringify(this.perfil));

  }


  cargarStorage() {

    if (localStorage.getItem('perfil')) {

      this.perfil = JSON.parse(localStorage.getItem('perfil'));

    } else {

      this.perfil = '';

    }
  }
}
