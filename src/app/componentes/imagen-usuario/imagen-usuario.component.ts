import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { ParamsService } from 'src/app/servicios/params.service';
import { UsuarioModel } from '../../models/usuario.model';

@Component({
	selector: 'app-imagen-usuario',
	templateUrl: './imagen-usuario.component.html',
	styleUrls: ['./imagen-usuario.component.css'],
})
export class ImagenUsuarioComponent {
	public token: string;
	public urls: any;
	usuario: UsuarioModel;

	constructor(private usuarioService: UsuarioService, private paramsService: ParamsService) {
		this.token = this.paramsService.conexion.token;
		this.urls = this.paramsService.urls;

		this.usuarioService
			.getUsuario(this.paramsService.conexion.noUsua, this.token, this.urls)
			.subscribe((res: any) => {
				this.usuario = res.body.usuario;
			});
	}

	onChangeFile(fileInput: any) {
		let file = fileInput.files.item(0);

		if (file) {
			this.usuarioService.cargarImagen(file, this.usuario, this.token, this.urls).subscribe(res => {
				this.usuarioService.getUsuario(this.usuario.noUsua, this.token, this.urls).subscribe((res1: any) => {
					console.log(res1);
					this.usuario.rutaImagen = res1.body.usuario.rutaImagen;
				});
			});
		}
	}
}
