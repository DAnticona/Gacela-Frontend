import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { RpoPlan } from '../modelos/rpo-plan.model';

@Injectable({
  providedIn: 'root'
})
export class RpoPlanService {

  constructor(private http: HttpClient) { }


  registraRpoPlan(urls: any, token: string, planes: RpoPlan[]) {

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };

    return this.http.post(urls.rpoPlanRegUrl, planes, httpOptions);

  }


  obtieneRpoPlan(urls: any, token: string) {

    const httpOptions = {

      headers: new HttpHeaders({
        token: `${token}`,
        'Content-Type': 'application/json'
      }),
      observe: 'response' as 'body'
    };

    return this.http.get(urls.rpoPlanLisUrl, httpOptions)
      .pipe(
        map((res: any) => {

          for (let p of res.body.planes.planes) {
    
            p.etaRpo = new Date(p.etaRpo + 'T00:00:00.000');
      
          }

          return res;
        })
      );

  }

}
