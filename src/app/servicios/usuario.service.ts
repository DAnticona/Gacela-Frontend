import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class UsuarioService {
	data: any;
	usuario: any;

	constructor(private http: HttpClient) {
		this.cargarStorage();
	}

	getUsuario(noUsua: string, token: string, urls: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				token: `${token}`,
				'Content-Type': 'application/json',
			}),

			observe: 'response' as 'body',

			params: new HttpParams().set('user', noUsua),
		};

		return this.http.get(urls.usuarioUrl, httpOptions);
	}

	updateUsuario(usuario: any, token: string, urls: any) {
		// console.log("token",token);
		// console.log("URLS",urls);
		// console.log("Usuario",usuario.feNaci.toISOString());

		// usuario.feNaci = new Date(usuario.feNaci);
		// console.log(usuario.feNaci);

		console.log(usuario);
		const httpOptions = {
			headers: new HttpHeaders({
				token: `${token}`,
				'Content-Type': 'application/json',
			}),

			observe: 'response' as 'body',
		};

		return this.http.put(urls.usuarioUrl, usuario, httpOptions).pipe(catchError(this.handleError));
	}

	guardarUsuario(usuario: any) {
		this.usuario = usuario;

		localStorage.setItem('usuario', JSON.stringify(this.usuario));
	}

	cargarImagen(file: any, usuario: UsuarioModel, token: string, urls: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				token: `${token}`,
				'Content-Type': 'multipart/form-data',
			}),

			observe: 'response' as 'body',
			params: new HttpParams().set('user', `${usuario.noUsua}`),
		};

		let formData: FormData = new FormData();
		formData.append('file', file);

		return this.http.put(urls.usuarioImagenUrl, file, httpOptions).pipe(catchError(this.handleError));
	}

	cargarStorage() {
		if (localStorage.getItem('usuario')) {
			this.usuario = JSON.parse(localStorage.getItem('usuario'));
		} else {
			this.usuario = '';
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
				`Mensaje del Servidor: ${errorResponse.status}, ` + `Cuerpo del mensaje: ${errorResponse.error}`
			);
		}
		// return an observable with a user-facing error message
		return throwError(errorResponse);
	}
}
