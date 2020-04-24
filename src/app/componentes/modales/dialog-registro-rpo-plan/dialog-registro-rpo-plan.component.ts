import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { RpoPlanService } from '../../../servicios/rpo-plan.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RpoPlan } from '../../../modelos/rpo-plan.model';
import { DatePipe } from '@angular/common';
import { ParamsService } from 'src/app/servicios/params.service';
import Swal from 'sweetalert2';
import { DialogListarNavesComponent } from '../../opciones/maestros/naves/dialog-listar-naves/dialog-listar-naves.component';
/**
 * Controlador que permite gestionar el registro o edición de un RPO desde una ventana modal (Dialog)
 * Todos los campos son requeridos:
 * El código de nave debe seleccionarse desde otra ventana.
 * El viaje, los montos y la fecha deben ser ingresado por el usuario.
 * - Autor: David Anticona - <danticona@wollcorp.com>
 * - Creado el: 20/04/2020
 */
@Component({
	selector: 'app-dialog-registro-rpo-plan',
	templateUrl: './dialog-registro-rpo-plan.component.html',
	styleUrls: ['./dialog-registro-rpo-plan.component.css'],
	providers: [DatePipe],
})
export class DialogRegistroRpoPlanComponent implements OnInit {
	/**
	 * Variable que almacena las url para conectarse al backend.
	 */
	private urls: any;

	/**
	 * Variable que almacena el token de la sesión para conectarse al backend.
	 */
	private token: string;

	/**
	 * Variable que almacena la fecha de hoy.
	 */
	public today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

	/**
	 * Variable que controla el formulario del template.
	 */
	public forma: FormGroup;

	/**
	 * Variable que controla el estado del componente.
	 */
	public cargando: boolean;

	constructor(
		private paramService: ParamsService,
		private dialogRef: MatDialogRef<DialogRegistroRpoPlanComponent>,
		private rpoPlanService: RpoPlanService,
		private datepipe: DatePipe,
		private dialog: MatDialog,
		@Inject(MAT_DIALOG_DATA) private rpo: RpoPlan
	) {
		this.urls = this.paramService.urls;
		this.token = this.paramService.conexion.token;

		this.forma = new FormGroup({
			coRpo: new FormControl(null),
			alNaveRpo: new FormControl({ value: null, disabled: true }, Validators.required),
			viajeRpo: new FormControl(null, Validators.required),
			ca2SdRpo: new FormControl(),
			ca4SdRpo: new FormControl(),
			ca4ShRpo: new FormControl(),
			etaRpo: new FormControl(),
			fgActiRpo: new FormControl('A'),
		});

		this.forma.setValue(this.rpo);
		this.forma.controls.etaRpo.setValue(this.datepipe.transform(this.rpo.etaRpo, 'yyyy-MM-dd'));
	}

	ngOnInit() {
		this.forma.controls.ca2SdRpo.setValidators([Validators.required, this.montoValido.bind(this)]);
		this.forma.controls.ca4SdRpo.setValidators([Validators.required, this.montoValido.bind(this)]);
		this.forma.controls.ca4ShRpo.setValidators([Validators.required, this.montoValido.bind(this)]);
		this.forma.controls.etaRpo.setValidators([
			Validators.required,
			this.minEtaValido.bind(this),
			this.etaValido.bind(this),
		]);
	}

	/**
	 * Método lanzado al hacer click al boton buscar Nave RPO.
	 * Llama al DialogBuscarNaveComponent y retorna el alias de la nave.
	 */
	public buscarNave(): void {
		const dialogRef = this.dialog.open(DialogListarNavesComponent, {
			width: '1000px',
			height: '800px',
		});

		dialogRef.afterClosed().subscribe((alNave: string) => {
			if (!alNave) {
				return;
			}

			this.forma.controls.alNaveRpo.setValue(alNave);
		});
	}

	/**
	 * Método lanzado al hacer click al boton aceptar.
	 * Guarda el RPO registrado en la base de datos y cierra el dialog.
	 */
	public onAceptar(): void {
		this.cargando = true;
		this.rpo = this.forma.getRawValue();
		let fechaStr = this.forma.controls.etaRpo.value;

		let eta = this.castFechaStringToDate(fechaStr);

		this.rpo.etaRpo = eta;
		this.rpoPlanService.registraRpoPlan(this.urls, this.token, this.rpo).subscribe(res => {
			Swal.fire({
				icon: 'success',
				title: 'Datos Procesados',
				text: 'Se guardaron los datos correctamente',
				showConfirmButton: false,
				timer: 2000,
				onClose: () => {
					this.cargando = false;
					this.dialogRef.close();
				},
			});
		});
	}

	/**
	 * Método lanzado al hacer click al boton Cancelar.
	 * Cierra el dialog.
	 */
	public onCancelar(): void {
		this.dialogRef.close();
	}

	/**
	 * Validador personalizado del formulario.
	 * Valida que la fecha no sea menor a 3 días de la fecha actual
	 * @param control Es el control a validar, debe ser tipo date.
	 */
	private minEtaValido(control: FormControl): { [val: string]: boolean } {
		let etaStr = String(control.value);

		let eta = this.castFechaStringToDate(etaStr);

		let minDate = new Date();
		minDate.setDate(minDate.getDate() - 3);

		if (eta.getTime() < minDate.getTime()) {
			return {
				fechaMinimaInvalida: true,
			};
		}

		return null;
	}

	/**
	 * Validador personalizado del formulario.
	 * En caso existan montos negativos, la fecha ingresada no debe ser menor a hoy.
	 * @param control Es el control a validar, debe ser tipo date.
	 */
	private etaValido(control: FormControl): { [val: string]: boolean } {
		let etaStr = String(control.value);

		let eta = this.castFechaStringToDate(etaStr);

		let ca2SdRpo = Number(this.forma.controls.ca2SdRpo.value);
		let ca4SdRpo = Number(this.forma.controls.ca4SdRpo.value);
		let ca4ShRpo = Number(this.forma.controls.ca4ShRpo.value);

		if (
			(ca2SdRpo < 0 || ca4SdRpo < 0 || ca4ShRpo < 0) &&
			(this.today.getTime() - eta.getTime()) / 1000 / 60 / 60 / 24 > 0
		) {
			return {
				fechaInvalida: true,
			};
		}
	}

	/**
	 * Validador personalizado del formulario.
	 * En caso la fecha sea menor que hoy, no debe ingresar montos negativos.
	 * @param control Es el control a analizar, debe ser tipo number.
	 */
	private montoValido(control: FormControl): { [val: string]: boolean } {
		let monto = Number(control.value);

		let fechaStr = this.forma.controls.etaRpo.value;

		let eta = this.castFechaStringToDate(fechaStr);

		if (monto < 0 && (this.today.getTime() - eta.getTime()) / 1000 / 60 / 60 / 24 > 0) {
			return {
				montoInvalido: true,
			};
		}

		return null;
	}

	/**
	 * Método auxiliar del programa que hace cast a una string de fecha
	 * con formato: 'yyyy-MM-dd' a un tipo Date.
	 * @param fechaSrt Es el string de fecha con formato 'yyyy-MM-dd'
	 */
	private castFechaStringToDate(fechaSrt: string): Date {
		let fecha = new Date(
			Number(fechaSrt.substr(0, 4)),
			Number(fechaSrt.substr(5, 2)) - 1,
			Number(fechaSrt.substr(8, 2))
		);

		return fecha;
	}
}
