import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class ParamsService {
	configUrl = 'assets/config.json';
	urls: any;
	conexion: any;

	constructor(private http: HttpClient) {
		this.cargarStorage();
	}

	getUrls() {
		return this.http.get(this.configUrl);
	}

	getLogin(login: any, urls: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				Authorization: 'basic ' + btoa(`${login.noUsua}:${login.paUsua}`),
				'Content-Type': 'application/json',
			}),
			observe: 'response' as 'body',
		};

		return this.http.get(urls.loginUrl, httpOptions);
	}

	getLogout(noUsua: string) {
		let token = this.conexion.token;

		const httpOptions = {
			headers: new HttpHeaders({
				token: `${token}`,
				'Content-Type': 'application/json',
			}),

			observe: 'response' as 'body',

			params: new HttpParams().set('usuario', noUsua),
		};

		this.removeAllData();

		return this.http.get(this.urls.logoutUrl, httpOptions);
	}

	removeAllData() {
		localStorage.clear();
	}

	cargarStorage() {
		if (localStorage.getItem('urls')) {
			this.urls = JSON.parse(localStorage.getItem('urls'));
		} else {
			this.urls = '';
		}

		if (localStorage.getItem('conexion')) {
			this.conexion = JSON.parse(localStorage.getItem('conexion'));
		} else {
			this.conexion = '';
		}
	}

	guardarUrls(urls: any) {
		this.urls = urls;

		localStorage.setItem('urls', JSON.stringify(this.urls));
	}

	guardarConexion(conexion: any) {
		this.conexion = conexion;

		localStorage.setItem('conexion', JSON.stringify(this.conexion));
	}
}
