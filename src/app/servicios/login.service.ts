import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Login } from '../clases/login';
import { Usuario } from '../clases/usuario';
import { Config } from '../interfaces/config';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }




  login(login: Login, config: Config): Observable<HttpResponse<Usuario>>{

    const httpOptions = {

      headers: new HttpHeaders({
        'Authorization': 'basic ' + btoa(`${login.noUsua}:${login.pasUsua}`),
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };

    return this.http.post<any>(config.loginUrl, '', httpOptions)
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
  };

}