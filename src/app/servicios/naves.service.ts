import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Nave } from '../models/nave.model';

@Injectable({
	providedIn: 'root',
})
export class NavesService {
	constructor(private http: HttpClient) {}

	// getNaves(token: string, urls: any) {
	// 	const httpOptions = {
	// 		headers: new HttpHeaders({
	// 			token: `${token}`,
	// 			'Content-Type': 'application/json',
	// 		}),

	// 		observe: 'response' as 'body',
	// 	};

	// 	return this.http.get(urls.naveUrlLis, httpOptions);
	// }

	obtieneNaves(token: string, urls: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				token: `${token}`,
				'Content-Type': 'application/json',
			}),

			observe: 'response' as 'body',
		};

		return this.http.get(urls.naveUrlLis, httpOptions);
	}

	registraNave(token: string, urls: any, nave: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				token: `${token}`,
				'Content-Type': 'application/json',
			}),

			observe: 'response' as 'body',
		};

		return this.http.post(urls.naveUrlReg, nave, httpOptions);
	}
}
