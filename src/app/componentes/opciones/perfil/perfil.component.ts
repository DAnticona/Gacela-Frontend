import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ParamsService } from '../../../servicios/params.service';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { TidocService } from '../../../servicios/tidoc.service';

@Component({
	selector: 'app-perfil',
	templateUrl: './perfil.component.html',
	styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent {
	usuario: UsuarioModel;
	tidocs: any = {};
	perfil: any[] = [];
	tidoc: any;

	noUsua: string;
	token: string;
	urls: any;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private paramsService: ParamsService,
		private usuarioService: UsuarioService,
		private tidocsService: TidocService
	) {
		this.noUsua = this.route.snapshot.paramMap.get('noUsua');
		this.token = this.paramsService.conexion.token;
		this.urls = this.paramsService.urls;

		this.usuarioService.getUsuario(this.noUsua, this.token, this.urls).subscribe((res: any) => {
			let fechaStr = res.body.usuario.feNaci + 'T00:00:00';
			this.usuario = res.body.usuario;
			this.usuario.feNaci = new Date(fechaStr);

			this.tidocsService.getTiDoc(this.token, this.urls).subscribe((res1: any) => {
				this.tidocs = res1.body.tiposDocumento;
				this.tidoc = this.tidocs.filter((tidoc: any) => tidoc.coTiDocu === this.usuario.tiDocu)[0];
			});
		});
	}

	editarPerfil() {
		this.usuarioService.guardarUsuario(this.usuario);

		this.router.navigate(['/welcome/usuario', this.noUsua]);
	}
}
