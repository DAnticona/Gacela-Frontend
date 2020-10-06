import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../servicios/usuario.service';
import { ParamsService } from '../../../servicios/params.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
	public token: string;
	public urls: any;

	usuario: any;
	perfil: any;

	constructor(private usuarioService: UsuarioService, private paramsService: ParamsService) {
		this.token = this.paramsService.conexion.token;
		this.urls = this.paramsService.urls;

		this.usuarioService
			.getUsuario(this.paramsService.conexion.noUsua, this.token, this.urls)
			.subscribe((res: any) => {
				this.usuario = res.body.usuario;
				this.perfil = this.usuario.perfil;
			});
	}

	ngOnInit() {}
}
