import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { BuscarProyventasolDialogComponent } from '../buscar-proyventasol-dialog/buscar-proyventasol-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ParamsService } from 'src/app/servicios/params.service';
import { ProyeccionService } from 'src/app/servicios/proyeccion-venta.service';
import { ProyeccionVentaCab } from 'src/app/models/ProyeccionVentaCab.model';
import Swal from 'sweetalert2';
import { ProyeccionVentaDet } from 'src/app/models/ProyeccionVentaDet.model';
import { DialogListarNavesComponent } from '../../maestros/naves/dialog-listar-naves/dialog-listar-naves.component';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-detproyventas',
	templateUrl: './detproyventas.component.html',
	styleUrls: ['./detproyventas.component.css'],
	providers: [DatePipe],
})
export class DetproyventasComponent {
	//

	token: string;
	urls: any;
	usuario: string;

	forma: FormGroup;
	detalles: FormGroup;

	proyeccionGenerada: any[];

	proyeccionCab = new ProyeccionVentaCab();

	codigo: string;
	coFile: string;
	today = new Date();

	cargando = false;
	isDisabled = false;

	constructor(
		public dialog: MatDialog,
		private route: ActivatedRoute,
		private router: Router,
		private paramsService: ParamsService,
		private proyeccionService: ProyeccionService,
		public datepipe: DatePipe
	) {
		this.proyeccionCab.detalles = new Array<ProyeccionVentaDet>();

		this.token = this.paramsService.conexion.token;
		this.urls = this.paramsService.urls;

		this.usuario = this.route.snapshot.paramMap.get('noUsua');
		this.codigo = this.route.snapshot.paramMap.get('coProy');

		this.forma = new FormGroup({
			coProyeccion: new FormControl({ value: null, disabled: true }),
			tipo: new FormControl({ value: 'DR', disabled: false }, Validators.required),
			fgActi: new FormControl({ value: 'P', disabled: false }, Validators.required),
			feProyeccion: new FormControl({ value: new Date(), disabled: true }, Validators.required),
			nroSem: new FormControl({ value: this.getWeek(new Date()), disabled: true }, Validators.required),
			coFile: new FormControl({ value: '', disabled: true }, Validators.required),
			to2SdNoFe: new FormControl({ value: 0, disabled: true }, Validators.required),
			to2SdFe: new FormControl({ value: 0, disabled: true }, Validators.required),
			to4SdNoFe: new FormControl({ value: 0, disabled: true }, Validators.required),
			to4SdFe: new FormControl({ value: 0, disabled: true }, Validators.required),
			to4ShNoFe: new FormControl({ value: 0, disabled: true }, Validators.required),
			to4ShFe: new FormControl({ value: 0, disabled: true }, Validators.required),
			to4RhNoFe: new FormControl({ value: 0, disabled: true }, Validators.required),
			to4RhFe: new FormControl({ value: 0, disabled: true }, Validators.required),
			to2SdNoFePick: new FormControl({ value: 0, disabled: true }, Validators.required),
			to2SdFePick: new FormControl({ value: 0, disabled: true }, Validators.required),
			to4SdNoFePick: new FormControl({ value: 0, disabled: true }, Validators.required),
			to4SdFePick: new FormControl({ value: 0, disabled: true }, Validators.required),
			to4ShNoFePick: new FormControl({ value: 0, disabled: true }, Validators.required),
			to4ShFePick: new FormControl({ value: 0, disabled: true }, Validators.required),
			to4RhNoFePick: new FormControl({ value: 0, disabled: true }, Validators.required),
			to4RhFePick: new FormControl({ value: 0, disabled: true }, Validators.required),
			to2SdBook: new FormControl({ value: 0, disabled: true }, Validators.required),
			to4SdBook: new FormControl({ value: 0, disabled: true }, Validators.required),
			to4ShBook: new FormControl({ value: 0, disabled: true }, Validators.required),
			to4RhBook: new FormControl({ value: 0, disabled: true }, Validators.required),
			to2SdPick: new FormControl({ value: 0, disabled: true }, Validators.required),
			to4SdPick: new FormControl({ value: 0, disabled: true }, Validators.required),
			to4ShPick: new FormControl({ value: 0, disabled: true }, Validators.required),
			to4RhPick: new FormControl({ value: 0, disabled: true }, Validators.required),
			usCrea: new FormControl({ value: this.usuario, disabled: true }, Validators.required),
			feCrea: new FormControl({ value: new Date(), disabled: true }, Validators.required),
			usModi: new FormControl({ value: this.usuario, disabled: true }, Validators.required),
			feModi: new FormControl({ value: new Date(), disabled: true }, Validators.required),

			detalles: new FormArray([], Validators.required),
		});

		if (this.codigo !== 'nuevo') {
			this.proyeccionService.getProyeccion(this.token, this.urls, this.codigo).subscribe((res: any) => {
				// console.log(res);

				this.proyeccionCab = res.body.proyeccionVenta;

				// console.log(this.proyeccionCab);
				this.proyeccionCab.detalles.sort((a, b) => a.eta.getTime() - b.eta.getTime());

				this.proyeccionCab.detalles.forEach(detalle => {
					this.getDetalle(detalle);
				});

				// this.forma.setValue(this.proyeccionCab);
				this.forma['controls'].coProyeccion.setValue(this.proyeccionCab.coProyeccion);
				this.forma['controls'].tipo.setValue(this.proyeccionCab.tipo);
				this.forma['controls'].fgActi.setValue(this.proyeccionCab.fgActi);
				this.forma['controls'].feProyeccion.setValue(this.proyeccionCab.feProyeccion);
				this.forma['controls'].nroSem.setValue(this.proyeccionCab.nroSem);
				this.forma['controls'].coFile.setValue(this.proyeccionCab.coFile);
				this.forma['controls'].to2SdNoFe.setValue(this.proyeccionCab.to2SdNoFe);
				this.forma['controls'].to2SdFe.setValue(this.proyeccionCab.to2SdFe);
				this.forma['controls'].to4SdNoFe.setValue(this.proyeccionCab.to4SdNoFe);
				this.forma['controls'].to4SdFe.setValue(this.proyeccionCab.to4SdFe);
				this.forma['controls'].to4ShNoFe.setValue(this.proyeccionCab.to4ShNoFe);
				this.forma['controls'].to4ShFe.setValue(this.proyeccionCab.to4ShFe);
				this.forma['controls'].to4RhNoFe.setValue(this.proyeccionCab.to4RhNoFe);
				this.forma['controls'].to4RhFe.setValue(this.proyeccionCab.to4RhFe);
				this.forma['controls'].to2SdNoFePick.setValue(this.proyeccionCab.to2SdNoFePick);
				this.forma['controls'].to2SdFePick.setValue(this.proyeccionCab.to2SdFePick);
				this.forma['controls'].to4SdNoFePick.setValue(this.proyeccionCab.to4SdNoFePick);
				this.forma['controls'].to4SdFePick.setValue(this.proyeccionCab.to4SdFePick);
				this.forma['controls'].to4ShNoFePick.setValue(this.proyeccionCab.to4ShNoFePick);
				this.forma['controls'].to4ShFePick.setValue(this.proyeccionCab.to4ShFePick);
				this.forma['controls'].to4RhNoFePick.setValue(this.proyeccionCab.to4RhNoFePick);
				this.forma['controls'].to4RhFePick.setValue(this.proyeccionCab.to4RhFePick);
				this.forma['controls'].to2SdBook.setValue(this.proyeccionCab.to2SdBook);
				this.forma['controls'].to4SdBook.setValue(this.proyeccionCab.to4SdBook);
				this.forma['controls'].to4ShBook.setValue(this.proyeccionCab.to4ShBook);
				this.forma['controls'].to4RhBook.setValue(this.proyeccionCab.to4RhBook);
				this.forma['controls'].to2SdPick.setValue(this.proyeccionCab.to2SdPick);
				this.forma['controls'].to4SdPick.setValue(this.proyeccionCab.to4SdPick);
				this.forma['controls'].to4ShPick.setValue(this.proyeccionCab.to4ShPick);
				this.forma['controls'].to4RhPick.setValue(this.proyeccionCab.to4RhPick);
				this.forma['controls'].usCrea.setValue(this.proyeccionCab.usCrea);
				this.forma['controls'].feCrea.setValue(this.proyeccionCab.feCrea);
				this.forma['controls'].usModi.setValue(this.proyeccionCab.usModi);
				this.forma['controls'].feModi.setValue(this.proyeccionCab.feModi);

				this.forma.controls['tipo'].disable();

				if (this.proyeccionCab.fgActi === 'C') {
					this.forma.disable();
				}
			});
		}
	}

	getWeek(fecha: Date) {
		let primerDia = new Date(fecha.getFullYear(), 0, 1);

		return Math.ceil(((fecha.getTime() - primerDia.getTime()) / 86400000 + primerDia.getDay() + 1) / 7);
	}

	agregarNave() {
		let item = (this.forma.controls['detalles'] as FormArray).length + 1;

		const dialogRef = this.dialog.open(DialogListarNavesComponent, {
			width: '1000px',
			height: '800px',
		});

		dialogRef.afterClosed().subscribe((alNave: string) => {
			if (!alNave) {
				return;
			}

			(this.forma.controls['detalles'] as FormArray).push(
				new FormGroup({
					idItem: new FormControl({ value: item, disabled: true }, Validators.required),
					alNave: new FormControl({ value: alNave, disabled: true }, Validators.required),
					viaje: new FormControl('', Validators.required),
					eta: new FormControl(this.datepipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required),

					ca2SdNoFe: new FormControl(0, [Validators.required, Validators.min(0)]),
					ca2SdFe: new FormControl(0, [Validators.required, Validators.min(0)]),
					ca4SdNoFe: new FormControl(0, [Validators.required, Validators.min(0)]),
					ca4SdFe: new FormControl(0, [Validators.required, Validators.min(0)]),
					ca4ShNoFe: new FormControl(0, [Validators.required, Validators.min(0)]),
					ca4ShFe: new FormControl(0, [Validators.required, Validators.min(0)]),
					ca4RhNoFe: new FormControl(0, [Validators.required, Validators.min(0)]),
					ca4RhFe: new FormControl(0, [Validators.required, Validators.min(0)]),
					ca2SdNoFePick: new FormControl(0, [Validators.required, Validators.min(0)]),
					ca2SdFePick: new FormControl(0, [Validators.required, Validators.min(0)]),
					ca4SdNoFePick: new FormControl(0, [Validators.required, Validators.min(0)]),
					ca4SdFePick: new FormControl(0, [Validators.required, Validators.min(0)]),
					ca4ShNoFePick: new FormControl(0, [Validators.required, Validators.min(0)]),
					ca4ShFePick: new FormControl(0, [Validators.required, Validators.min(0)]),
					ca4RhNoFePick: new FormControl(0, [Validators.required, Validators.min(0)]),
					ca4RhFePick: new FormControl(0, [Validators.required, Validators.min(0)]),
				})
			);
		});
	}

	quitaNave(index: number) {
		(this.forma.controls['detalles'] as FormArray).removeAt(index);
		this.actualizaTotales();
	}

	getFileMTC1R999(): void {
		const dialogRef = this.dialog.open(BuscarProyventasolDialogComponent, {
			width: '1000px',
			height: '800px',
		});

		dialogRef.afterClosed().subscribe((coFile: string) => {
			if (!coFile) {
				return;
			}

			this.coFile = coFile;

			this.forma.controls.coFile.setValue(this.coFile);

			this.proyeccionService
				.generaResumenProyeccion(this.token, this.urls, this.coFile)
				.subscribe((res: any) => {
					// console.log(res);

					this.proyeccionGenerada = res.body.proyeccionGenerada;

					// for (let p of this.proyeccionGenerada) {

					//   p.eta = new Date(p.eta + 'T00:00:00.000');

					// }

					// console.log(this.proyeccionGenerada);

					// OBTENIENDO LAS CLAVES UNICAS PARA EL FILTRADO (NAVE, VIAJE, ETA)
					this.proyeccionCab.detalles = new Array<ProyeccionVentaDet>();

					this.proyeccionGenerada.forEach(p => {
						// console.log(this.proyeccionCab.detalles.filter(d => d.alNave === p.alNave && d.viaje === p.viaje && d.eta === p.eta));

						if (
							this.proyeccionCab.detalles.filter(
								d => d.alNave === p.alNave && d.viaje === p.viaje && d.eta.getTime() === p.eta.getTime()
							).length === 0
						) {
							let detalle = new ProyeccionVentaDet();

							detalle.idItem = this.proyeccionCab.detalles.length + 1;
							detalle.alNave = p.alNave;
							detalle.viaje = p.viaje;
							detalle.eta = p.eta;

							this.proyeccionCab.detalles.push(detalle);
						}
					});

					// console.log(this.proyeccionCab.detalles);
					this.proyeccionCab.detalles.sort((a, b) => {
						if (a.eta < b.eta) {
							return -1;
						} else {
							return 1;
						}
					});

					this.proyeccionCab.detalles.forEach(d => {
						this.proyeccionGenerada
							.filter(
								f => f.alNave === d.alNave && f.viaje === d.viaje && f.eta.getTime() === d.eta.getTime()
							)
							.forEach(p => {
								if (p.tpe === '2SD' && p.fgFarEast === 'S') {
									d.ca2SdFe = p.qty;
									d.ca2SdFePick = p.pick;
								} else if (p.tpe === '2SD' && p.fgFarEast === 'N') {
									d.ca2SdNoFe = p.qty;
									d.ca2SdNoFePick = p.pick;
								} else if (p.tpe === '4SD' && p.fgFarEast === 'S') {
									d.ca4SdFe = p.qty;
									d.ca4SdFePick = p.pick;
								} else if (p.tpe === '4SD' && p.fgFarEast === 'N') {
									d.ca4SdNoFe = p.qty;
									d.ca4SdNoFePick = p.pick;
								} else if (p.tpe === '4SH' && p.fgFarEast === 'S') {
									d.ca4ShFe = p.qty;
									d.ca4ShFePick = p.pick;
								} else if (p.tpe === '4SH' && p.fgFarEast === 'N') {
									d.ca4ShNoFe = p.qty;
									d.ca4ShNoFePick = p.pick;
								} else if (p.tpe === '4RH' && p.fgFarEast === 'S') {
									d.ca4RhFe = p.qty;
									d.ca4RhFePick = p.pick;
								} else if (p.tpe === '4RH' && p.fgFarEast === 'N') {
									d.ca4RhNoFe = p.qty;
									d.ca4RhNoFePick = p.pick;
								}
							});

						this.getDetalle(d);
					});

					this.actualizaTotales();
				});
		});
	}

	getDetalle(detalle: ProyeccionVentaDet) {
		(this.forma.controls['detalles'] as FormArray).push(
			new FormGroup({
				idItem: new FormControl({ value: detalle.idItem, disabled: true }, Validators.required),
				alNave: new FormControl({ value: detalle.alNave, disabled: true }, Validators.required),
				viaje: new FormControl(detalle.viaje, Validators.required),
				eta: new FormControl(this.datepipe.transform(detalle.eta, 'yyyy-MM-dd'), Validators.required),

				ca2SdNoFe: new FormControl(detalle.ca2SdNoFe, [Validators.required, Validators.min(0)]),
				ca2SdFe: new FormControl(detalle.ca2SdFe, [Validators.required, Validators.min(0)]),
				ca4SdNoFe: new FormControl(detalle.ca4SdNoFe, [Validators.required, Validators.min(0)]),
				ca4SdFe: new FormControl(detalle.ca4SdFe, [Validators.required, Validators.min(0)]),
				ca4ShNoFe: new FormControl(detalle.ca4ShNoFe, [Validators.required, Validators.min(0)]),
				ca4ShFe: new FormControl(detalle.ca4ShFe, [Validators.required, Validators.min(0)]),
				ca4RhNoFe: new FormControl(detalle.ca4RhNoFe, [Validators.required, Validators.min(0)]),
				ca4RhFe: new FormControl(detalle.ca4RhFe, [Validators.required, Validators.min(0)]),
				ca2SdNoFePick: new FormControl(detalle.ca2SdNoFePick, [Validators.required, Validators.min(0)]),
				ca2SdFePick: new FormControl(detalle.ca2SdFePick, [Validators.required, Validators.min(0)]),
				ca4SdNoFePick: new FormControl(detalle.ca4SdNoFePick, [Validators.required, Validators.min(0)]),
				ca4SdFePick: new FormControl(detalle.ca4SdFePick, [Validators.required, Validators.min(0)]),
				ca4ShNoFePick: new FormControl(detalle.ca4ShNoFePick, [Validators.required, Validators.min(0)]),
				ca4ShFePick: new FormControl(detalle.ca4ShFePick, [Validators.required, Validators.min(0)]),
				ca4RhNoFePick: new FormControl(detalle.ca4RhNoFePick, [Validators.required, Validators.min(0)]),
				ca4RhFePick: new FormControl(detalle.ca4RhFePick, [Validators.required, Validators.min(0)]),
			})
		);
	}

	getNaves(item: number) {
		const dialogRef = this.dialog.open(DialogListarNavesComponent, {
			width: '1000px',
			height: '800px',
		});

		dialogRef.afterClosed().subscribe((result: string) => {
			if (!result) {
				return;
			}

			(this.forma.controls['detalles'] as FormArray).controls[item]['controls']['alNave'].setValue(result);
		});
	}

	actualizaTotales() {
		let ca2SdNoFe = 0;
		let ca2SdFe = 0;
		let ca4SdNoFe = 0;
		let ca4SdFe = 0;
		let ca4ShNoFe = 0;
		let ca4ShFe = 0;
		let ca4RhNoFe = 0;
		let ca4RhFe = 0;

		let ca2SdNoFePick = 0;
		let ca2SdFePick = 0;
		let ca4SdNoFePick = 0;
		let ca4SdFePick = 0;
		let ca4ShNoFePick = 0;
		let ca4ShFePick = 0;
		let ca4RhNoFePick = 0;
		let ca4RhFePick = 0;

		(this.forma.controls['detalles'] as FormArray).controls.forEach(detalle => {
			ca2SdNoFe = ca2SdNoFe + detalle['controls']['ca2SdNoFe'].value;
			ca2SdFe = ca2SdFe + detalle['controls']['ca2SdFe'].value;
			ca4SdNoFe = ca4SdNoFe + detalle['controls']['ca4SdNoFe'].value;
			ca4SdFe = ca4SdFe + detalle['controls']['ca4SdFe'].value;
			ca4ShNoFe = ca4ShNoFe + detalle['controls']['ca4ShNoFe'].value;
			ca4ShFe = ca4ShFe + detalle['controls']['ca4ShFe'].value;
			ca4RhNoFe = ca4RhNoFe + detalle['controls']['ca4RhNoFe'].value;
			ca4RhFe = ca4RhFe + detalle['controls']['ca4RhFe'].value;

			ca2SdNoFePick = ca2SdNoFePick + detalle['controls']['ca2SdNoFePick'].value;
			ca2SdFePick = ca2SdFePick + detalle['controls']['ca2SdFePick'].value;
			ca4SdNoFePick = ca4SdNoFePick + detalle['controls']['ca4SdNoFePick'].value;
			ca4SdFePick = ca4SdFePick + detalle['controls']['ca4SdFePick'].value;
			ca4ShNoFePick = ca4ShNoFePick + detalle['controls']['ca4ShNoFePick'].value;
			ca4ShFePick = ca4ShFePick + detalle['controls']['ca4ShFePick'].value;
			ca4RhNoFePick = ca4RhNoFePick + detalle['controls']['ca4RhNoFePick'].value;
			ca4RhFePick = ca4RhFePick + detalle['controls']['ca4RhFePick'].value;
		});

		this.forma.controls['to2SdNoFe'].setValue(ca2SdNoFe);
		this.forma.controls['to2SdFe'].setValue(ca2SdFe);
		this.forma.controls['to4SdNoFe'].setValue(ca4SdNoFe);
		this.forma.controls['to4SdFe'].setValue(ca4SdFe);
		this.forma.controls['to4ShNoFe'].setValue(ca4ShNoFe);
		this.forma.controls['to4ShFe'].setValue(ca4ShFe);
		this.forma.controls['to4RhNoFe'].setValue(ca4RhNoFe);
		this.forma.controls['to4RhFe'].setValue(ca4RhFe);

		this.forma.controls['to2SdNoFePick'].setValue(ca2SdNoFePick);
		this.forma.controls['to2SdFePick'].setValue(ca2SdFePick);
		this.forma.controls['to4SdNoFePick'].setValue(ca4SdNoFePick);
		this.forma.controls['to4SdFePick'].setValue(ca4SdFePick);
		this.forma.controls['to4ShNoFePick'].setValue(ca4ShNoFePick);
		this.forma.controls['to4ShFePick'].setValue(ca4ShFePick);
		this.forma.controls['to4RhNoFePick'].setValue(ca4RhNoFePick);
		this.forma.controls['to4RhFePick'].setValue(ca4RhFePick);

		this.forma.controls['to2SdBook'].setValue(Number(ca2SdNoFe + ca2SdFe));
		this.forma.controls['to4SdBook'].setValue(Number(ca4SdNoFe + ca4SdFe));
		this.forma.controls['to4ShBook'].setValue(Number(ca4ShNoFe + ca4ShFe));
		this.forma.controls['to4RhBook'].setValue(Number(ca4RhNoFe + ca4RhFe));

		this.forma.controls['to2SdPick'].setValue(Number(ca2SdNoFePick + ca2SdFePick));
		this.forma.controls['to4SdPick'].setValue(Number(ca4SdNoFePick + ca4SdFePick));
		this.forma.controls['to4ShPick'].setValue(Number(ca4ShNoFePick + ca4ShFePick));
		this.forma.controls['to4RhPick'].setValue(Number(ca4RhNoFePick + ca4RhFePick));
	}

	guardar() {
		// console.log('enviando:', this.forma.getRawValue());

		this.cargando = true;
		this.isDisabled = true;

		this.proyeccionCab = new ProyeccionVentaCab();
		this.proyeccionCab = this.forma.getRawValue();

		for (let p of this.proyeccionCab.detalles) {
			p.eta = new Date(p.eta + 'T00:00:00.000');
		}

		// console.log(this.proyeccionCab);

		this.proyeccionService.registraProyeccion(this.token, this.urls, this.proyeccionCab).subscribe(
			(res: any) => {
				// console.log(res);
				let coProyeccion = res.body.proyeccionVenta.coProyeccion;
				Swal.fire({
					icon: 'success',
					title: 'Datos Guardados',
					text: 'Código Proyección: ' + coProyeccion,
					showConfirmButton: false,
					timer: 2000,
					onClose: () => {
						this.cargando = false;
						this.isDisabled = false;
					},
				});

				this.forma.controls['coProyeccion'].setValue(coProyeccion);
			},
			(err: any) => {
				console.log(err);
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: err.error.error.mensaje,
					footer: 'Comuníquese con el administrador del sistema',
					onClose: () => {
						this.cargando = false;
						this.isDisabled = false;
					},
				});
			}
		);
	}

	cancelar() {
		this.router.navigate(['../'], { relativeTo: this.route });
	}
}
