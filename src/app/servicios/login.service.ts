import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { Login } from '../clases/login';
import { Usuario } from '../clases/usuario';
import { Config } from '../interfaces/config';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router, private usuarioService: UsuarioService) { }

  login(login: Login, config: Config): Observable<any>{

    return this.http.post<any>(config.loginUrl, login).pipe(
      catchError(this.handleError)
    );
  }

  routeWelcomePage(usuario: Usuario){
    this.usuarioService.setUsuario(usuario);
    this.router.navigate([`welcome/${usuario.noUsua.toLowerCase()}`]);
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