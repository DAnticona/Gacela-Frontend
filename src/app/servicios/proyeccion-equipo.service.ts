import { Injectable } from '@angular/core';
import { ProyeccionFileCab } from '../models/proyeccionFileCab.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProyeccionEquipoService {

  constructor(private http: HttpClient) { }

  registraProyeccion(token: string, urls: any, proyeccion: ProyeccionFileCab) {

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };

    return this.http.post(urls.proyeccionFileRegUrl, proyeccion, httpOptions);

  }
}
