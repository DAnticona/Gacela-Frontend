import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LineasService {

  constructor(private http: HttpClient) { }


  getLineas(token: string, urls: any) {

    const httpOptions = {

      headers: new HttpHeaders({

        token: `${token}`,
        'Content-Type': 'application/json'
        
      }),

      observe: 'response' as 'body'

    };

    return this.http.get(urls.lineaUrlLis, httpOptions);

  }
}
