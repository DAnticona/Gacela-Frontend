import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ProyeccionVentaCab } from '../models/ProyeccionVentaCab.model';
import { ProyeccionEquipoCab } from '../models/proyeccionEquipoCab.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProyeccionService {

  

  constructor(private http: HttpClient) { }

  getProyecciones(token: string, urls: any) {

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };

    return this.http.get(urls.proyeccionesLisUrl, httpOptions);

  }

  getProyeccion(token: string, urls: any, codigo: string) {

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body',
      params: new HttpParams().set('codigo', codigo)
    };

    return this.http.get(urls.proyeccionDetUrl, httpOptions);

  }


  registraProyeccion(token: string, urls: any, proyeccion: ProyeccionVentaCab) {

    // console.log(proyeccion);

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };

    return this.http.post(urls.proyeccionRegUrl, proyeccion, httpOptions);

  }

  generaResumenProyeccion(token: string, urls: any, coFile: string) {

    // console.log('generando');

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body',
      params: new HttpParams().set('codigo', coFile)
    };

    return this.http.get(urls.proyeccionGenXFileUrl, httpOptions)
      .pipe(
        map((res: any) => {

          for (let p of res.body.proyeccionGenerada) {
    
            p.eta = new Date(p.eta + 'T00:00:00.000');
      
          }

          return res;
          
        })
      );

  }


  generaExcel(token: string, urls: any, proyeccion: any) {

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };

    return this.http.post(urls.proyeccionEquExcel, proyeccion, httpOptions);

  }


  obtieneRatio(token: string, urls: any) {

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };

    return this.http.get(urls.ratioLisUrl, httpOptions);

  }

  registraRatio(token: string, urls: any, ratio: any) {

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };

    return this.http.post(urls.ratioRegUrl, ratio, httpOptions);

  }


}
