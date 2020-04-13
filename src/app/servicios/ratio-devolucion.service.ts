import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

/**
 * Servicio encargado de consultar y registrar datos de los ratios de devolución
 * - Autor: David Anticona <danticona@wollcorp.com>
 * - Creado: 06/03/2020
 * - Modificado: 
 * @version 1.0
 */
@Injectable({
  providedIn: 'root'
})
export class RatioDevolucionService {

  constructor(private http: HttpClient) { }


  obtieneRatio(token: string, urls: any) {

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };

    return this.http.get(urls.ratioDevolucionLisUrl, httpOptions)
      .pipe(
        map((res: any) => {

          if(res.body.ratio.feCrea && res.body.ratio.feModi) {

            res.body.ratio.feCrea = new Date(res.body.ratio.feCrea.substr(0,4), Number(res.body.ratio.feCrea.substr(5,2) - 1), res.body.ratio.feCrea.substr(8,2));
            res.body.ratio.feModi = new Date(res.body.ratio.feModi.substr(0,4), Number(res.body.ratio.feModi.substr(5,2) - 1), res.body.ratio.feModi.substr(8,2));

          }

          return res;
        })
      );

  }

  registraRatio(token: string, urls: any, ratio: any) {

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };

    return this.http.post(urls.ratioDevolucionRegUrl, ratio, httpOptions);

  }
}
