import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class ServicioService {
	constructor(private http: HttpClient) {}

	getServicios(token: string, urls: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				token: `${token}`,
				'Content-Type': 'application/json',
			}),

			observe: 'response' as 'body',
		};

		return this.http.get(urls.servicioUrl, httpOptions);
	}
}
