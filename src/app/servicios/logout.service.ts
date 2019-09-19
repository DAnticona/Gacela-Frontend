import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  // logoutUrl: string;
  config: any;

  constructor(private http: HttpClient,
              private configService: ConfigService) {

    // this.configService.getInitConfig().subscribe(data => {
    //   this.logoutUrl = data.logoutUrl;
    // });
    this.config = this.configService.getConfig();
  }

  logout(): Observable<any> {

    
    let noUsua = this.configService.getUsuario();
    let token = this.configService.getToken();

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body',
      params: new HttpParams()
        .set('usuario', noUsua)
    };

    this.configService.removeAllData();

    return this.http.get<any>(this.config.logoutUrl, httpOptions).pipe(
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
  }
}
