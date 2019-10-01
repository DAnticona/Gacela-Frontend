import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class TidocService {

  urls: any;
  tiDoc: any;

  constructor(private http: HttpClient,
    private config: ConfigService) {

    this.cargarStorage();

    this.config.getUrls()
      .subscribe(res => {
        this.urls = res;
        console.log(res);
      });
  }



  getTiDoc(token: string) {

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };

    return this.http.get(this.urls.tipoDocumentoUrl, httpOptions);
  }


  guardarTiDoc(tiDoc: any) {

    this.tiDoc = tiDoc;

    localStorage.setItem('tiDoc', JSON.stringify(this.tiDoc));

  }


  cargarStorage() {

    if (localStorage.getItem('tiDoc')) {

      this.tiDoc = JSON.parse(localStorage.getItem('tiDoc'));

    } else {

      this.tiDoc = '';

    }
  }
}
