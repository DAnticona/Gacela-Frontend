import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  configUrl = 'assets/config.json';
  urls: any;
  conexion: any;

  constructor(private http: HttpClient,
              private configService: ConfigService) {

    this.cargarStorage();
    this.configService.getUrls()
      .subscribe(res => {
        this.urls = res;
      });


  }


  getLogin(login: any) {

    console.log(this.urls);

    const httpOptions = {

      headers: new HttpHeaders({
        Authorization: 'basic ' + btoa(`${login.noUsua}:${login.paUsua}`),
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };

    return this.http.post(this.urls.loginUrl, '', httpOptions);

    // return this.http.post(this.urls.loginUrl, '', httpOptions)
    // .pipe(
    //   map((res: any) => {
    //     console.log(res);
    //     res.body.usuario.feNaci = new Date(res.body.usuario.feNaci.year, (res.body.usuario.feNaci.monthValue - 1), res.body.usuario.feNaci.dayOfMonth);
    //     return res
    //   }),
    //   catchError(this.handleError)
    // );

  }


  guardarConexion(conexion: any) {

    this.conexion = conexion;

    localStorage.setItem('conexion', JSON.stringify(this.conexion));

  }


  cargarStorage() {

    if (localStorage.getItem('conexion')) {

      this.conexion = JSON.parse(localStorage.getItem('conexion'));

    } else {

      this.conexion = '';

    }
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
