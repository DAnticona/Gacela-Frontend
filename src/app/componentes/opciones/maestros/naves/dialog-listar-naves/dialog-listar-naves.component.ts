import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NavesService } from '../../../../../servicios/naves.service';
import { ParamsService } from 'src/app/servicios/params.service';

@Component({
	selector: 'app-dialog-listar-naves',
	templateUrl: './dialog-listar-naves.component.html',
	styleUrls: ['./dialog-listar-naves.component.css'],
})
export class DialogListarNavesComponent implements OnInit {
	naves: any[] = [];
	navesFiltradas: any[] = [];

	codigoSol: string;

	token: string;
	urls: any;

	constructor(
		public dialogRef: MatDialogRef<DialogListarNavesComponent>,
		private navesService: NavesService,
		private paramsService: ParamsService
	) {
		this.token = this.paramsService.conexion.token;
		this.urls = this.paramsService.urls;

		this.navesService.obtieneNaves(this.token, this.urls).subscribe((res: any) => {
			// console.log(res);
			this.naves = res.body.naves;

			this.navesFiltradas = this.naves;

			// console.log(this.navesFiltradas);
		});
	}

	ngOnInit() {}

	filtrar(coNave: string, alNave: string, noNave: string, fgActi: string) {
		if (fgActi === '99') {
			fgActi = '';
		}

		this.navesFiltradas = this.naves.filter(nave => {
			if (fgActi !== '99') {
				return (
					nave.coNave.includes(coNave.toUpperCase()) &&
					nave.fgActi.includes(fgActi) &&
					nave.alNave.includes(alNave.toUpperCase()) &&
					nave.noNave.includes(noNave.toUpperCase())
				);
			}
		});

		// console.log(this.archivosFiltrados);
	}

	seleccionar(i: number) {
		this.codigoSol = this.navesFiltradas[i].alNave;
	}

	onAceptar() {
		// this.dialogRef.close(this.forma.value);
		// console.log(this.codigoSel);
		this.dialogRef.close(this.codigoSol);
	}

	onCancelar(): void {
		this.dialogRef.close();
	}
}
