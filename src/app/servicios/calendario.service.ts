import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {

  urls: any;

  constructor(private http: HttpClient,
              private configService: ConfigService) {

    this.configService.getUrls()
      .subscribe(res => {
        this.urls = res;
      }
    );
  }


  getCalendario(token: string, urls: any, fechaIni: string, fechaFin: string) {

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body',
      params: new HttpParams().set('fechaIni', fechaIni)
                              .set('fechaFin', fechaFin)
    };

    return this.http.get(urls.calendarioUrl, httpOptions)
      .pipe(
        map((res: any) => {

          res.body.calendario.forEach(c => {
            c.fecha = new Date(c.ano, c.mes - 1, c.dia);
          });

          return res;

      }));

  }


}
