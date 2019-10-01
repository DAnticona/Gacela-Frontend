import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ForecastCab } from '../clases/forecast-cab';
import { ConfigService } from './config.service';
import { LoginService } from './login.service';
import { ParamsService } from './params.service';

@Injectable({
  providedIn: 'root'
})
export class ForecastService {

  token: string;
  urls: any;
  naves: any;
  servicios: any;

  constructor(private http: HttpClient) { }

  getData(url: string, token: string): Observable<any> {

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };

    return this.http.get<any>(url, httpOptions)
    .pipe(
      catchError(this.handleError)
    );

  }

  loadFile(url: string, forecastCab: ForecastCab, token: string) {

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };

    return this.http.post<any>(url, forecastCab, httpOptions)
    .pipe(
      catchError(this.handleError)
    );

  }

  downloadFile(url: string, token: string) {

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };

    return this.http.get<any>(url, httpOptions)
    .pipe(
      catchError(this.handleError)
    );

  }

  deleteFile(url: string, token: string) {

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };

    return this.http.delete<any>(url, httpOptions)
    .pipe(
      catchError(this.handleError)
    );

  }

  private handleError(errorResponse: HttpErrorResponse) {

    if (errorResponse.error instanceof ErrorEvent) {

      // A client-side or network error occurred. Handle it accordingly.
      console.error('Error del lado del cliente: ', errorResponse.error.message);

    } else {

      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Mensaje del Servidor: ${errorResponse.status}, ` +
        `Cuerpo del mensaje: ${errorResponse.error}`
      );

    }
    // return an observable with a user-facing error message
    return throwError(errorResponse);
  }

}
