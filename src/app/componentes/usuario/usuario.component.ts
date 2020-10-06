import { Component, PipeTransform } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { ParamsService } from '../../servicios/params.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioModel } from '../../models/usuario.model';
import { TidocService } from '../../servicios/tidoc.service';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-usuario',
	templateUrl: './usuario.component.html',
	styleUrls: ['./usuario.component.css'],
	providers: [DatePipe],
})
export class UsuarioComponent {
	error: any;

	forma: FormGroup;
	usuarioModel = new UsuarioModel();
	usuario: any;

	cargando = false;
	editable = true;

	tiDocus: any[] = [];

	token: string;
	noUsua: string;
	urls: any;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private usuarioService: UsuarioService,
		private paramsService: ParamsService,
		private tidocsService: TidocService,
		private datePipe: DatePipe
	) {
		this.noUsua = this.route.snapshot.paramMap.get('noUsua');
		this.token = this.paramsService.conexion.token;
		this.urls = this.paramsService.urls;

		this.forma = new FormGroup({
			coPers: new FormControl({ value: '', disabled: true }),
			noUsua: new FormControl({ value: '', disabled: this.editable }, Validators.required),
			noPerf: new FormControl({ value: '', disabled: this.editable }, Validators.required),
			tiDocu: new FormControl('', Validators.required),
			nuDocu: new FormControl('', Validators.required),
			noPers: new FormControl('', Validators.required),
			apPate: new FormControl('', Validators.required),
			apMate: new FormControl('', Validators.required),
			sexo: new FormControl('', Validators.required),
			feNaci: new FormControl('', Validators.required),
			email: new FormControl('', [
				Validators.required,
				Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'),
			]),
			rutaImagen: new FormControl(''),
		});

		this.usuarioService.getUsuario(this.noUsua, this.token, this.urls).subscribe((res: any) => {
			this.usuario = res.body.usuario;
			let fechaStr = res.body.usuario.feNaci + 'T00:00:00';
			this.usuario.feNaci = new Date(fechaStr);

			this.tidocsService.getTiDoc(this.token, this.urls).subscribe((res1: any) => {
				this.tiDocus = res1.body.tiposDocumento;
				this.cargaForma();
			});
		});
	}

	cargaForma() {
		this.usuarioModel.coPers = this.usuario.coPers;
		this.usuarioModel.tiDocu = this.usuario.tiDocu;
		this.usuarioModel.nuDocu = this.usuario.nuDocu;
		this.usuarioModel.noPers = this.usuario.noPers;
		this.usuarioModel.apPate = this.usuario.apPate;
		this.usuarioModel.apMate = this.usuario.apMate;
		this.usuarioModel.sexo = this.usuario.sexo;
		this.usuarioModel.feNaci = this.usuario.feNaci;
		this.usuarioModel.email = this.usuario.email;
		this.usuarioModel.rutaImagen = this.usuario.rutaImagen;
		this.usuarioModel.noUsua = this.usuario.noUsua;
		this.usuarioModel.noPerf = this.usuario.perfil.noPerf;

		this.forma.controls.coPers.setValue(this.usuarioModel.coPers);
		this.forma.controls.noUsua.setValue(this.usuarioModel.noUsua);
		this.forma.controls.noPerf.setValue(this.usuarioModel.noPerf);
		this.forma.controls.tiDocu.setValue(this.usuarioModel.tiDocu);
		this.forma.controls.nuDocu.setValue(this.usuarioModel.nuDocu);
		this.forma.controls.noPers.setValue(this.usuarioModel.noPers);
		this.forma.controls.apPate.setValue(this.usuarioModel.apPate);
		this.forma.controls.apMate.setValue(this.usuarioModel.apMate);
		this.forma.controls.sexo.setValue(this.usuarioModel.sexo);
		this.forma.controls.feNaci.setValue(this.datePipe.transform(this.usuarioModel.feNaci, 'yyyy-MM-dd'));
		this.forma.controls.email.setValue(this.usuarioModel.email);
		this.forma.controls.rutaImagen.setValue(this.usuarioModel.rutaImagen);

		this.forma.controls['nuDocu'].setValidators([this.validatorNroDoc.bind(this.forma)]);
	}

	validatorNroDoc(control: FormControl): { [s: string]: boolean } {
		let forma: any = this;

		if (forma.controls['tiDocu'].value === '001') {
			if (isNaN(control.value) || control.value.length !== 8) {
				return {
					validatorNroDoc: true,
				};
			}
		} else if (forma.controls['tiDocu'].value === '002') {
			if (control.value.length > 12) {
				return {
					validatorNroDoc: true,
				};
			}
		}

		return null;
	}

	guardarDatos() {
		this.cargando = true;

		this.usuarioModel = this.forma.getRawValue();
		let feNaci = this.forma.controls.feNaci.value;

		this.usuario.tiDocu = this.usuarioModel.tiDocu;
		this.usuario.nuDocu = this.usuarioModel.nuDocu;
		this.usuario.noPers = this.usuarioModel.noPers;
		this.usuario.apPate = this.usuarioModel.apPate;
		this.usuario.apMate = this.usuarioModel.apMate;
		this.usuario.sexo = this.usuarioModel.sexo;
		this.usuario.feNaci = new Date(feNaci.substr(0, 4), feNaci.substr(5, 2) - 1, feNaci.substr(8, 2));
		this.usuario.email = this.usuarioModel.email;
		this.usuario.rutaImagen = this.usuarioModel.rutaImagen;
		this.usuario.feCreaPers = null;
		this.usuario.feModiPers = null;
		this.usuario.feCreaUsua = null;
		this.usuario.feModiUsua = null;
		this.usuario.feUltSes = null;
		this.usuario.perfil.feCreaPerf = null;
		this.usuario.perfil.feModiPerf = null;

		this.usuarioService.updateUsuario(this.usuario, this.token, this.urls).subscribe(
			res => {
				this.cargando = false;
				this.router.navigateByUrl(`/welcome/perfil/${this.noUsua}`);
			},
			err => {
				console.log(err);
				this.error = err.error;
				this.cargando = false;
			}
		);
	}
}
