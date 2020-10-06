import { Component } from '@angular/core';
import { ParamsService } from '../../servicios/params.service';
import { MenuService } from '../../servicios/menu.service';
import { UsuarioService } from '../../servicios/usuario.service';

@Component({
	selector: 'app-side-bar',
	templateUrl: './side-bar.component.html',
	styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent {
	public token: string;
	public urls: any;
	noUsua: string;
	coPerf: string;
	menus: any;
	usuario: any;

	constructor(
		private paramsServcice: ParamsService,
		private menuService: MenuService,
		private usuarioService: UsuarioService
	) {
		this.token = this.paramsServcice.conexion.token;
		this.urls = this.paramsServcice.urls;
		this.noUsua = this.paramsServcice.conexion.noUsua;

		this.usuarioService.getUsuario(this.noUsua, this.token, this.urls).subscribe((res: any) => {
			this.usuario = res.body.usuario;
			this.coPerf = this.usuario.perfil.coPerf;
			this.menuService.getMenusXPerfil(this.coPerf, this.token, this.urls).subscribe((res1: any) => {
				this.menus = res1.body.menus;
				this.menus.sort((a, b) => a.nrOrde - b.nrOrde);
			});
		});
	}

	clickMenu(i: number) {
		this.menus.forEach((menu, index) => {
			if (index !== i) {
				menu.expanded = false;
			} else {
				menu.expanded = !menu.expanded;
			}
		});
	}

	clickSubMenu(i: number) {
		this.menus.forEach((menu, index) => {
			if (index !== i) {
				menu.activo = false;
			} else {
				menu.activo = true;
			}
		});
	}
}
