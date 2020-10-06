import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ParamsService } from '../../servicios/params.service';
import { UsuarioService } from '../../servicios/usuario.service';

@Component({
	selector: 'app-nav-bar',
	templateUrl: './nav-bar.component.html',
	styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
	usuario: any;
	error: any;

	constructor(
		private router: Router,
		private paramsService: ParamsService,
		private usuarioService: UsuarioService
	) {
		this.usuarioService
			.getUsuario(
				this.paramsService.conexion.noUsua,
				this.paramsService.conexion.token,
				this.paramsService.urls
			)
			.subscribe((res: any) => {
				this.usuario = res.body.usuario;
			});
	}

	ngOnInit() {}

	logout() {
		this.paramsService.getLogout(this.usuario.noUsua).subscribe(
			res => {
				this.router.navigate(['login']);
			},
			err => {
				console.log(err);
				// this.error = err.error;
			}
		);
	}
}
