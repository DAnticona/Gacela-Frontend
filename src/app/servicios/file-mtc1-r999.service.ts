import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FileCabMTC1R999 } from '../models/fileCabMTC1R999.model';

@Injectable({
  providedIn: 'root'
})
export class FileMTC1R999Service {

  constructor(private http: HttpClient) { }

  registrarFile(token: string, urls: any, fileCab: FileCabMTC1R999) {

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };

    return this.http.post(urls.fileMTC1R999RegUrl, fileCab, httpOptions);

  }


  listarFiles(token: string, urls: any) {

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };

    return this.http.get(urls.fileMTC1R999LisUrl, httpOptions);

  }

  getFile(token: string, urls: any, coFile: string) {

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body',
      params: new HttpParams().set('codigo', coFile)
    };

    return this.http.get(urls.fileMTC1R999GetUrl, httpOptions);

  }

  
}
