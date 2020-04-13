import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }



  downloadFile(urls: any, fileName: string) {

    window.open(`${urls.reportUrl}/${fileName}`, '_blank');

  }




  deleteFile(url: any, fileName: string, token: string) {

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      params: new HttpParams().set('fileName', fileName),
      observe: 'response' as 'body'
    };

    return this.http.delete(url.reportUrl, httpOptions);

  }
}
