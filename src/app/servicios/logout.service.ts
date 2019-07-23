import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { ConfigService } from '../servicios/config.service';

import { Usuario } from '../clases/usuario';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private http: HttpClient,
              private router: Router,
              private configService: ConfigService) { }

  logOut(usuario: Usuario): Observable<any>{
    return this.http.post<any>(this.configService.configUrl, usuario.usuario).pipe(
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
        `Mensaje del Servidor ${errorResponse.status}, ` +
        `Cuerpo del mensaje: ${errorResponse.error}`
      );

    }
    // return an observable with a user-facing error message
    return throwError(
      errorResponse.error
    );
  };
}
