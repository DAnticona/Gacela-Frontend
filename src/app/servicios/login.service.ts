import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Login } from '../clases/login';
import { ConfigService } from './config.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  configUrl = 'assets/config.json';
  config: any;

  constructor(private http: HttpClient,
              private configService: ConfigService,
              private router: Router) {

    // console.log('loginService')

    this.configService.getInitConfig().subscribe(config => {
      this.config = config;
    });
  }


  getLogin(login: Login): Observable<HttpResponse<any>> {
    
    const httpOptions = {

      headers: new HttpHeaders({
        Authorization: 'basic ' + btoa(`${login.noUsua}:${login.pasUsua}`),
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };
    
    return this.http.post<any>(this.config.loginUrl, '', httpOptions)
    .pipe(
      catchError(this.handleError)
    );
    
  }


  routeWelcomePage(usuario: string) {

    this.router.navigate([`welcome/${usuario}`]);

  }


  guardarDatos(usuario: any, token: string) {

    this.configService.guardarToken(token);
    this.configService.guardarUsuario(usuario);
    this.configService.guardarConfig(this.config);
    
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
