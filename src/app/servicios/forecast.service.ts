import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ForecastCab } from '../models/forecastCab.model';

@Injectable({
  providedIn: 'root'
})
export class ForecastService {

  token: string;
  urls: any;
  naves: any;
  servicios: any;

  constructor(private http: HttpClient) { }

  loadFile(urls: any, forecastCab: ForecastCab, token: string) {

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };

    return this.http.post(urls.forecastUrl, forecastCab, httpOptions);

  }
}
