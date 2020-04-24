//#region IMPORTACIONES

import { Component } from '@angular/core';
import { ServicioService } from '../../../servicios/servicio.service';
import { ParamsService } from '../../../servicios/params.service';
import { NavesService } from '../../../servicios/naves.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProyeccionService } from 'src/app/servicios/proyeccion-venta.service';
import { FileCabMTC1R999 } from 'src/app/models/fileCabMTC1R999.model';
import { FileDetMTC1R999 } from 'src/app/models/fileDetMTC1R999.model';
import { FileMTC1R999Service } from '../../../servicios/file-mtc1-r999.service';
import { ProyeccionEquipoCab } from '../../../models/proyeccionEquipoCab.model';
import { ProyeccionEquipoDet } from 'src/app/models/proyeccionEquipoDet.model';
import { FileService } from '../../../servicios/file.service';
import { DialogListarNavesComponent } from '../maestros/naves/dialog-listar-naves/dialog-listar-naves.component';
import { DatePipe } from '@angular/common';
import { RpoPlan } from '../../../models/rpoPlan.model';
import { RpoPlanService } from '../../../servicios/rpo-plan.service';
import { CalendarioService } from '../../../servicios/calendario.service';
import { DialogRegistrarNavesComponent } from '../maestros/naves/dialog-registrar-naves/dialog-registrar-naves.component';
import { Nave } from 'src/app/models/nave.model';

//#endregion IMPORTACIONES

/**
 * Controlador para mostrar y generar una proyección de equipos
 * a partir de una proyección de ventas y un archivo tipo MTC1R999.
 * - Autor: David Anticona <danticona@wollcorp.com>
 * - Creado el: 06/03/2020
 * - Modificado el:
 * @version 1.0
 * @copyright wollcorp.com
 * @license Gacela-1.0
 */
@Component({
	selector: 'app-proyecciones',
	templateUrl: './proyecciones.component.html',
	styleUrls: ['./proyecciones.component.css'],
	providers: [DatePipe],
})
export class ProyeccionesComponent {
	//#region VARIABLES

	// VARIABLES PARA PARAMETROS PARA CONEXIÓN
	urls: any;
	token: string;

	// VARIABLES PARA RECIBIR DATOS REQUERIDOS
	servicios: any[] = [];
	naves: any[] = [];
	files: any[] = [];
	file: any;

	// VARIABLES PARA LA LECTURA Y ORGANIZACION DEL ARCHIVO TXT
	fileCabMTC1R999: FileCabMTC1R999;

	// VARIABLES PARA LA PROYECCION
	proyVenta: any;
	resumen: any[] = [];
	proyeccionEquipo: ProyeccionEquipoCab;
	rpoPlanes: RpoPlan[] = [];
	ratioDevolucion: any = {};
	calendario: any[];

	// VARIABLES PARA FUNCIONAMIENTO DEL PROGRAMA
	forma: FormGroup;
	linkReal = true;
	generar = false;
	navesNoRegistradas: any[] = [];
	today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
	lastEta: Date;
	cargando = false;
	cargandoFile = false;
	ratioDisponible = false;

	to2SdRatio: number;
	to4SdRatio: number;
	to4ShRatio: number;

	rpoValidos: any[] = [];

	//#endregion VARIABLES

	constructor(
		private servicioService: ServicioService,
		private paramService: ParamsService,
		private navesService: NavesService,
		public dialog: MatDialog,
		private proyeccionService: ProyeccionService,
		private fileMTC1R999Service: FileMTC1R999Service,
		private datepipe: DatePipe,
		private rpoPlanService: RpoPlanService,
		private fileService: FileService,
		private calendarioService: CalendarioService
	) {
		this.urls = this.paramService.urls;
		this.token = this.paramService.conexion.token;

		this.forma = new FormGroup({
			coProyEquipo: new FormControl({ value: '', disabled: true }, Validators.required),
			coProyVenta: new FormControl({ value: '', disabled: true }, Validators.required),
			coFile: new FormControl({ value: '', disabled: true }, Validators.required),

			tipo: new FormControl({ value: 'DR', disabled: false }, Validators.required),
			feProyeccion: new FormControl({ value: new Date(), disabled: true }, Validators.required),
			fgActi: new FormControl({ value: 'A', disabled: false }, Validators.required),
			nroSem: new FormControl({ value: 0, disabled: true }, Validators.required),

			stock2Sd: new FormControl(0, [Validators.min(0), Validators.required]),
			stock4Sd: new FormControl(0, [Validators.min(0), Validators.required]),
			stock4Sh: new FormControl(0, [Validators.min(0), Validators.required]),
			stock4Rh: new FormControl(0, [Validators.min(0), Validators.required]),

			detalles: new FormArray([]),

			to2SdNoFe: new FormControl(0),
			to2SdFe: new FormControl(0),
			to4SdNoFe: new FormControl(0),
			to4SdFe: new FormControl(0),
			to4ShNoFe: new FormControl(0),
			to4ShFe: new FormControl(0),
			to4RhNoFe: new FormControl(0),
			to4RhFe: new FormControl(0),
			to2SdNoFePick: new FormControl(0),
			to2SdFePick: new FormControl(0),
			to4SdNoFePick: new FormControl(0),
			to4SdFePick: new FormControl(0),
			to4ShNoFePick: new FormControl(0),
			to4ShFePick: new FormControl(0),
			to4RhNoFePick: new FormControl(0),
			to4RhFePick: new FormControl(0),

			to2SdBook: new FormControl(0),
			to4SdBook: new FormControl(0),
			to4ShBook: new FormControl(0),
			to4RhBook: new FormControl(0),

			to2SdPick: new FormControl(0),
			to4SdPick: new FormControl(0),
			to4ShPick: new FormControl(0),
			to4RhPick: new FormControl(0),

			ratioDevolucion: new FormGroup({
				ra2Sd: new FormControl(0),
				ra4Sd: new FormControl(0),
				ra4Sh: new FormControl(0),
				usCrea: new FormControl(''),
				usModi: new FormControl(''),
				feCrea: new FormControl(new Date()),
				feModi: new FormControl(new Date()),
				nroDiasHabilesMes: new FormControl(0),
				nroDiasHoyARetorno: new FormControl(0),
				fechaRatioStr: new FormControl(''),
			}),

			rpoPlan: new FormArray([]),

			available2Sd: new FormControl(0),
			available4Sd: new FormControl(0),
			available4Sh: new FormControl(0),
			available4Rh: new FormControl(0),

			usCrea: new FormControl({ value: '', disabled: true }, Validators.required),
			usModi: new FormControl({ value: '', disabled: true }, Validators.required),
			feCrea: new FormControl({ value: '', disabled: true }, Validators.required),
			feModi: new FormControl({ value: '', disabled: true }, Validators.required),
		});

		this.proyeccionEquipo = new ProyeccionEquipoCab();
		this.forma.setValue(this.proyeccionEquipo);

		this.obtieneDatosIniciales();
		this.obtieneRatioDevolucion();
	}

	//#region CONEXION_BD

	/**
	 * Obtiene los datos requeridos para las proyecciones.
	 * - Servicios a la variable "servicios".
	 * - Naves a la variable "naves".
	 */
	obtieneDatosIniciales() {
		this.servicioService.getServicios(this.token, this.urls).subscribe((res1: any) => {
			this.servicios = res1.body.servicios;

			this.navesService.obtieneNaves(this.token, this.urls).subscribe((res2: any) => {
				this.naves = res2.body.naves;

				this.obtieneProyeccionVentaActiva();
				this.obtieneFileActivo();
			});
		});
	}

	/**
	 * Obtiene la proyección de ventas activa.
	 * El resultado lo almacena en la variable "proyVenta"
	 */
	obtieneProyeccionVentaActiva() {
		this.proyeccionService.getProyecciones(this.token, this.urls).subscribe((res1: any) => {
			if (res1.body.proyecciones.filter(p1 => p1.fgActi === 'A').length > 0) {
				let coProyAct = res1.body.proyecciones.filter(p1 => p1.fgActi === 'A')[0].coProyeccion;

				this.proyeccionService.getProyeccion(this.token, this.urls, coProyAct).subscribe((res2: any) => {
					this.proyVenta = res2.body.proyeccion;

					this.proyVenta.detalles.sort((a, b) => new Date(a.eta).getTime() - new Date(b.eta).getTime());
				});
			}
		});
	}

	/**
	 * Obtiene el último file MTC1R999 guardado en la base de datos.
	 * - Guarda los resultados en la variable "fileCabMTC1R999".
	 * - Muestra las naves que existen en el archivo pero no estas registradas en la BD.
	 */
	obtieneFileActivo() {
		this.fileMTC1R999Service.listarFiles(this.token, this.urls).subscribe((res1: any) => {
			this.files = res1.body.filesCab;

			if (this.files.filter(f => f.fgActi === 'A').length > 0) {
				let coFileAct = this.files.filter(f => f.fgActi === 'A')[0].coFile;
				// this.archivoNuevo = false;

				this.fileMTC1R999Service.getFile(this.token, this.urls, coFileAct).subscribe((res2: any) => {
					this.fileCabMTC1R999 = res2.body.fileCab;

					this.navesNoRegistradas = this.obtieneNavesNoRegistradas(this.fileCabMTC1R999.detalle, this.naves);
				});
			}
		});
	}

	/**
	 * Obtiene los ratios de devolución desde la base de datos.
	 */
	obtieneRatioDevolucion() {
		this.proyeccionService.obtieneRatio(this.token, this.urls).subscribe((res: any) => {
			/*
        this.proyeccionEquipo.ratioDevolucion = res.body.ratio;
        this.proyeccionEquipo.ratioDevolucion.feCrea = new Date(Number(res.body.ratio.feCrea.substr(0,4)), Number(res.body.ratio.feCrea.substr(5,2)) - 1, Number(res.body.ratio.feCrea.substr(8,2)));
        this.proyeccionEquipo.ratioDevolucion.feModi = new Date(Number(res.body.ratio.feModi.substr(0,4)), Number(res.body.ratio.feModi.substr(5,2)) - 1, Number(res.body.ratio.feModi.substr(8,2)));
        this.proyeccionEquipo.ratioDevolucion.nroDiasHabilesMes = 24;
        this.proyeccionEquipo.ratioDevolucion.nroDiasHoyARetorno = 0;
        this.proyeccionEquipo.ratioDevolucion.fechaRatioStr = '';

        this.forma.controls.ratioDevolucion.setValue(this.proyeccionEquipo.ratioDevolucion);
        */

			this.ratioDevolucion = res.body.ratio;
			this.ratioDevolucion.feCrea = new Date(
				Number(res.body.ratio.feCrea.substr(0, 4)),
				Number(res.body.ratio.feCrea.substr(5, 2)) - 1,
				Number(res.body.ratio.feCrea.substr(8, 2))
			);
			this.ratioDevolucion.feModi = new Date(
				Number(res.body.ratio.feModi.substr(0, 4)),
				Number(res.body.ratio.feModi.substr(5, 2)) - 1,
				Number(res.body.ratio.feModi.substr(8, 2))
			);
			this.ratioDevolucion.nroDiasHabilesMes = 24;
			this.ratioDevolucion.nroDiasHoyARetorno = 0;
			this.ratioDevolucion.fechaRatioStr = '';

			this.forma.controls.ratioDevolucion.setValue(this.ratioDevolucion);

			this.ratioDisponible = this.isRatioDisponible();
		});
	}

	/**
	 * Obtiene el plan RPO desde la BD:
	 */
	obtieneRpoPlan() {
		this.rpoPlanService.obtieneRpoPlan(this.urls, this.token).subscribe((res1: any) => {
			this.rpoPlanes = res1.body.planes.planes;

			this.forma.controls['rpoPlan'] = new FormArray([]);

			this.rpoPlanes.forEach(rp => {
				this.addFormRpoPlan();
			});

			(this.forma.controls['rpoPlan'] as FormArray).setValue(this.rpoPlanes);
		});
	}

	//#endregion CONEXION_BD

	//#region SET_FORM

	/**
	 * Agrega un registro tipo RPO al formulario.
	 */
	addFormRpoPlan() {
		(this.forma.controls['rpoPlan'] as FormArray).push(
			new FormGroup({
				coRpo: new FormControl({ value: null, disabled: true }, Validators.required),
				alNaveRpo: new FormControl({ value: null, disabled: true }, Validators.required),
				viajeRpo: new FormControl(null, Validators.required),
				etaRpo: new FormControl(this.datepipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required),
				ca2SdRpo: new FormControl(0, Validators.required),
				ca4SdRpo: new FormControl(0, Validators.required),
				ca4ShRpo: new FormControl(0, Validators.required),
				ca4RhRpo: new FormControl(0, Validators.required),
				fgActiRpo: new FormControl(null),
			})
		);
	}

	/**
	 * Método lanzado al hacer click al boton "+"
	 * para agregar un nuevo registro al RPO plan
	 */
	addRpo() {
		this.getNave()
			.then(res => {
				let alNave = res;

				this.addFormRpoPlan();

				let index = (this.forma.controls['rpoPlan'] as FormArray).length - 1;

				(this.forma.controls['rpoPlan'] as FormArray).controls[index]['controls']['alNaveRpo'].setValue(
					alNave
				);

				this.actualizaTotales();
			})
			.catch(err => console.log(err));
	}

	/**
	 * Método lanzado al dar click al boton Editar nave del RPO plan.
	 * Permite modificar la nave seleccionada en un RPO plan.
	 */
	setNaveRPO(index: number) {
		this.getNave()
			.then(res => {
				let alNave = res;

				(this.forma.controls['rpoPlan'] as FormArray).controls[index]['controls']['alNaveRpo'].setValue(
					alNave
				);
			})
			.catch(err => console.log(err));
	}

	/**
	 * Método lanzado al dar click en eliminar registro RPO.
	 * @param index Índice del registro del RPO plan para, permite identificar el registro a eliminar.
	 */
	delRPO(index: number) {
		(this.forma.controls['rpoPlan'] as FormArray).removeAt(index);
		this.actualizaTotales();
	}

	//#endregion SET_FORM

	//#region EVENTOS
	/**
	 * Método lanzado al hacer click en el boton "Generar Proyección".
	 * - Trae el resumen de la proyección de la BD.
	 * - Agrega horas 0 a las fechas para corregir el problema de zona horaria.
	 * - Calcula fechas de inicio y fin para obtener el número de días hábiles.
	 */
	generaProyeccionEquipos() {
		this.generar = true;

		this.proyeccionEquipo.rpoPlan = new Array<RpoPlan>();
		this.proyeccionEquipo.feProyeccion = new Date();
		this.proyeccionEquipo.coFile = this.fileCabMTC1R999.coFile;
		this.proyeccionEquipo.coProyVenta = this.proyVenta.coProyeccion;

		this.proyeccionService
			.generaResumenProyeccion(this.token, this.urls, this.fileCabMTC1R999.coFile)
			.subscribe((res: any) => {
				this.resumen = res.body.proyeccionGenerada;

				// DEFINIENDO FECHAS
				for (let p of this.resumen) {
					p.eta = new Date(p.eta + 'T00:00:00.000');
				}

				this.proyeccionEquipo = this.resumenToProyeccion(this.resumen);

				this.obtieneRatioDevolucion();
				this.obtieneRpoPlan();

				// CALCULA FECHAS OBTENER FERIADOS
				let fechaFin = new Date(
					this.proyeccionEquipo.detalles[this.proyeccionEquipo.detalles.length - 1].eta.getTime()
				);
				let fechaIni = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
				fechaIni.setDate(fechaIni.getDate() - 7);

				this.calculaRetornoVacio(fechaIni, fechaFin);
			});
	}

	/**
	 * Método lanzado al hacer click en el boton "cargar archivo"
	 * - Lee el archivo txt MTC1R999.
	 * - Guarda el archivo en base de datos.
	 * - Lanza el método "obtieneFileActivo" para traer los datos del archivo guardado
	 */
	cargarFile(fileList: FileList) {
		this.cargandoFile = true;

		let file = fileList[0];

		if (file) {
			this.fileCabMTC1R999.noFile = file.name;
			this.fileCabMTC1R999.feCargaFile = new Date();
			this.fileCabMTC1R999.fgActi = 'A';

			let fileReader = new FileReader();

			fileReader.onload = e => {
				this.fileCabMTC1R999.detalle = this.leerTxt(fileReader.result);

				this.fileMTC1R999Service.registrarFile(this.token, this.urls, this.fileCabMTC1R999).subscribe(
					(res: any) => {
						this.obtieneFileActivo();
						this.cargandoFile = false;
					},

					(err: any) => {
						this.cargandoFile = false;
						this.navesNoRegistradas = [];
						this.fileCabMTC1R999 = null;
					}
				);
			};

			fileReader.readAsText(file);
		}
	}

	/**
	 * Método lanzado al dar click al boton "agregar"
	 * referente a las naves no registradas en BD
	 * y actualiza el listado de naves y la lista de naves no registradas en BD.
	 * @param index Es el índice del listado de la snaves no registradas en BD
	 */
	registraNave(index: number) {
		const dialogRef = this.dialog.open(DialogRegistrarNavesComponent, {
			width: '1000px',
			height: '800px',
			data: {
				alNave: this.navesNoRegistradas[index],
			},
		});

		dialogRef.afterClosed().subscribe(result => {
			this.navesService.obtieneNaves(this.token, this.urls).subscribe((res: any) => {
				this.naves = res.body.naves;
				this.navesNoRegistradas = this.obtieneNavesNoRegistradas(this.fileCabMTC1R999.detalle, this.naves);
			});
		});
	}

	/**
	 * Método lanzado al cambiar el ETA de los RPO existentes,
	 * Llama a todas las validaciones RPO particulares.
	 * @param index Índice para identificar el registro RPO.
	 */
	etaValido(index: number) {
		this.ca2SdRpoValido(index);
		this.ca4SdRpoValido(index);
		this.ca4ShRpoValido(index);
	}

	/**
	 * Método lanzado al hacer click al botón "Guardar Ratio".
	 * Guarda el ratio de devolución (Solo los lunes) en BD
	 */
	guardarRatio() {
		let ratioDevolucion: any = (this.forma.controls.ratioDevolucion as FormGroup).getRawValue();

		this.proyeccionService.registraRatio(this.token, this.urls, ratioDevolucion).subscribe(res => {
			this.cargando = true;

			Swal.fire({
				icon: 'success',
				title: 'Datos Procesados',
				text: 'Se guardaron los ratios de devolución',
				showConfirmButton: false,
				timer: 2000,
				onClose: () => {
					this.cargando = false;
				},
			});
		});
	}

	/**
	 * Método lanzado al hacer click en el boton "Exportar".
	 * Exporta la proyección a excel.
	 */
	guardarProyeccion() {
		this.cargando = true;

		this.proyeccionEquipo.stock2Sd = this.forma.controls.stock2Sd.value;
		this.proyeccionEquipo.stock4Sd = this.forma.controls.stock4Sd.value;
		this.proyeccionEquipo.stock4Sh = this.forma.controls.stock4Sh.value;
		this.proyeccionEquipo.stock4Rh = this.forma.controls.stock4Rh.value;

		this.rpoPlanes = (this.forma.controls.rpoPlan as FormArray).getRawValue();

		this.rpoPlanes.forEach(rp => {
			rp.etaRpo = new Date(rp.etaRpo + 'T00:00:00.000');
		});

		let proyeccionEquipoExcel = {
			proyEquipo: this.proyeccionEquipo,
			proyVenta: this.proyVenta,
			rpoPlanes: this.rpoPlanes,
		};

		// this.rpoPlanService.registraRpoPlan(this.urls, this.token, this.rpoPlanes)
		//   .subscribe(
		//     res => {

		this.proyeccionService
			.generaExcel(this.token, this.urls, proyeccionEquipoExcel)
			.subscribe((res1: any) => {
				let fileName = res1.body.excelName;

				Swal.fire({
					icon: 'success',
					title: 'Datos Procesados',
					text: 'Se procesó el archivo: ' + fileName,
					showConfirmButton: false,
					timer: 2000,
					onBeforeOpen: () => {
						this.fileService.downloadFile(this.urls, fileName);
					},
					onClose: () => {
						this.cargando = false;

						this.fileService.deleteFile(this.urls, fileName, this.token).subscribe(del => {
							console.log(del);
						});
					},
				});
			});
		// },

		// err => {
		//   console.log(err);
		//   this.cargando = false;
		// }
		// );
	}

	/**
	 * Método lanzado al cambiar los montos del formulario
	 * Actualiza los totales de la proyección de equipos.
	 * Este método debe llamarse cada vez que se ingresan nuevos valores al formulario.
	 */
	actualizaTotales() {
		let to2SdRpo = 0;
		let to4SdRpo = 0;
		let to4ShRpo = 0;
		let to4RhRpo = 0;

		(this.forma.controls['rpoPlan'] as FormArray).controls.forEach(detalle => {
			to2SdRpo = to2SdRpo + detalle['controls']['ca2SdRpo'].value;
			to4SdRpo = to4SdRpo + detalle['controls']['ca4SdRpo'].value;
			to4ShRpo = to4ShRpo + detalle['controls']['ca4ShRpo'].value;
			to4RhRpo = to4RhRpo + detalle['controls']['ca4RhRpo'].value;
		});

		this.proyeccionEquipo.available2Sd =
			this.to2SdRatio +
			Number(this.forma.controls.stock2Sd.value) +
			this.proyeccionEquipo.to2SdBook +
			this.proyeccionEquipo.to2SdPick +
			to2SdRpo;
		this.proyeccionEquipo.available4Sd =
			this.to4SdRatio +
			Number(this.forma.controls.stock4Sd.value) +
			this.proyeccionEquipo.to4SdBook +
			this.proyeccionEquipo.to4SdPick +
			to4SdRpo;
		this.proyeccionEquipo.available4Sh =
			this.to4ShRatio +
			Number(this.forma.controls.stock4Sh.value) +
			this.proyeccionEquipo.to4ShBook +
			this.proyeccionEquipo.to4ShPick +
			to4ShRpo;
		this.proyeccionEquipo.available4Rh =
			Number(this.forma.controls.stock4Rh.value) +
			this.proyeccionEquipo.to4RhBook +
			this.proyeccionEquipo.to4RhPick +
			to4RhRpo;
	}

	//#endregion EVENTOS

	//#region UTILITARIOS

	/**
	 * Genera la proyección de equipos a partir del resumen obtenido desde la BD.
	 * - Obtiene el detalle de la proyección ordenado por ETA
	 * - Calcula totales iniciales de la proyección de equipos
	 * @param resumen Resumen obtenido desde la BD
	 * @returns Proyección generada a partir del resumen.
	 */
	private resumenToProyeccion(resumen: any[]): ProyeccionEquipoCab {
		let proyeccion = new ProyeccionEquipoCab();

		resumen.forEach(p => {
			if (
				proyeccion.detalles.filter(
					d => d.alNave === p.alNave && d.viaje === p.viaje && d.eta.getTime() === p.eta.getTime()
				).length === 0
			) {
				let det = new ProyeccionEquipoDet();

				det.idItem = proyeccion.detalles.length + 1;
				det.alNave = p.alNave;
				det.viaje = p.viaje;
				det.eta = p.eta;

				proyeccion.detalles.push(det);
			}
		});

		proyeccion.detalles.forEach(d => {
			resumen
				.filter(f => f.alNave === d.alNave && f.viaje === d.viaje && f.eta === d.eta)
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
		});

		proyeccion.detalles.sort((a, b) => new Date(a.eta).getTime() - new Date(b.eta).getTime());

		proyeccion.to2SdFe = 0;
		proyeccion.to2SdNoFe = 0;
		proyeccion.to4SdNoFe = 0;
		proyeccion.to4SdFe = 0;
		proyeccion.to4ShNoFe = 0;
		proyeccion.to4ShFe = 0;
		proyeccion.to4RhNoFe = 0;
		proyeccion.to4RhFe = 0;
		proyeccion.to2SdNoFePick = 0;
		proyeccion.to2SdFePick = 0;
		proyeccion.to4SdNoFePick = 0;
		proyeccion.to4SdFePick = 0;
		proyeccion.to4ShNoFePick = 0;
		proyeccion.to4ShFePick = 0;
		proyeccion.to4RhNoFePick = 0;
		proyeccion.to4RhFePick = 0;

		proyeccion.detalles.forEach(d => {
			proyeccion.to2SdFe = proyeccion.to2SdFe + d.ca2SdFe;
			proyeccion.to2SdNoFe = proyeccion.to2SdNoFe + d.ca2SdNoFe;
			proyeccion.to4SdFe = proyeccion.to4SdFe + d.ca4SdFe;
			proyeccion.to4SdNoFe = proyeccion.to4SdNoFe + d.ca4SdNoFe;
			proyeccion.to4ShFe = proyeccion.to4ShFe + d.ca4ShFe;
			proyeccion.to4ShNoFe = proyeccion.to4ShNoFe + d.ca4ShNoFe;
			proyeccion.to4RhFe = proyeccion.to4RhFe + d.ca4RhFe;
			proyeccion.to4RhNoFe = proyeccion.to4RhNoFe + d.ca4RhNoFe;

			proyeccion.to2SdFePick = proyeccion.to2SdFePick + d.ca2SdFePick;
			proyeccion.to2SdNoFePick = proyeccion.to2SdNoFePick + d.ca2SdNoFePick;
			proyeccion.to4SdFePick = proyeccion.to4SdFePick + d.ca4SdFePick;
			proyeccion.to4SdNoFePick = proyeccion.to4SdNoFePick + d.ca4SdNoFePick;
			proyeccion.to4ShFePick = proyeccion.to4ShFePick + d.ca4ShFePick;
			proyeccion.to4ShNoFePick = proyeccion.to4ShNoFePick + d.ca4ShNoFePick;
			proyeccion.to4RhFePick = proyeccion.to4RhFePick + d.ca4RhFePick;
			proyeccion.to4RhNoFePick = proyeccion.to4RhNoFePick + d.ca4RhNoFePick;
		});

		proyeccion.to2SdBook = proyeccion.to2SdFe + proyeccion.to2SdNoFe;
		proyeccion.to4SdBook = proyeccion.to4SdFe + proyeccion.to4SdNoFe;
		proyeccion.to4ShBook = proyeccion.to4ShFe + proyeccion.to4ShNoFe;
		proyeccion.to4RhBook = proyeccion.to4RhFe + proyeccion.to4RhNoFe;

		proyeccion.to2SdPick = proyeccion.to2SdFePick + proyeccion.to2SdNoFePick;
		proyeccion.to4SdPick = proyeccion.to4SdFePick + proyeccion.to4SdNoFePick;
		proyeccion.to4ShPick = proyeccion.to4ShFePick + proyeccion.to4ShNoFePick;
		proyeccion.to4RhPick = proyeccion.to4RhFePick + proyeccion.to4RhNoFePick;

		return proyeccion;
	}

	/**
	 * Calcula el retorno vacío para la proyección de equipos.
	 * - Obtiene los días hábiles para el cálculo.
	 * - Obtiene el último ETA de la proyección de equipos.
	 * - Obtiene el calendario desde la BD.
	 * - Calcula los valores a partir de los ratios de devolución.
	 * @param fechaIni Fecha de inicio para obtener el calendario.
	 * @param fechaFin Fecha final para obtener el calendario.
	 */
	calculaRetornoVacio(fechaIni: Date, fechaFin: Date) {
		// 6 DIAS A LA SEMANA (SIN DOMINGO) POR 4 SEMANAS (MES)
		const DIAS_HABILES = 24;
		this.proyeccionEquipo.ratioDevolucion.nroDiasHabilesMes = DIAS_HABILES;

		let lastEta = new Date(
			this.proyeccionEquipo.detalles[this.proyeccionEquipo.detalles.length - 1].eta.getTime()
		);
		this.proyeccionEquipo.ratioDevolucion.fechaRatioStr = this.datepipe.transform(
			lastEta.setDate(lastEta.getDate() - 7),
			'MMM dd'
		);

		this.calendarioService
			.getCalendario(
				this.token,
				this.urls,
				this.datepipe.transform(fechaIni, 'yyyy-MM-dd'),
				this.datepipe.transform(fechaFin, 'yyyy-MM-dd')
			)
			.subscribe((res2: any) => {
				this.calendario = res2.body.calendario;

				let nroDiasHoyARetorno = this.calendario.filter(
					c => c.fecha.getTime() > this.today.getTime() && c.fecha.getTime() <= lastEta && c.fgFeriado === 'N'
				).length;
				this.proyeccionEquipo.ratioDevolucion.nroDiasHoyARetorno = nroDiasHoyARetorno;

				this.proyeccionEquipo.ratioDevolucion.ra2Sd = this.ratioDevolucion.ra2Sd;
				this.proyeccionEquipo.ratioDevolucion.ra4Sd = this.ratioDevolucion.ra4Sd;
				this.proyeccionEquipo.ratioDevolucion.ra4Sh = this.ratioDevolucion.ra4Sh;

				this.to2SdRatio = Math.round(
					(this.ratioDevolucion.ra2Sd / DIAS_HABILES) *
						this.proyeccionEquipo.ratioDevolucion.nroDiasHoyARetorno
				);
				this.to4SdRatio = Math.round(
					(this.ratioDevolucion.ra4Sd / DIAS_HABILES) *
						this.proyeccionEquipo.ratioDevolucion.nroDiasHoyARetorno
				);
				this.to4ShRatio = Math.round(
					(this.ratioDevolucion.ra4Sh / DIAS_HABILES) *
						this.proyeccionEquipo.ratioDevolucion.nroDiasHoyARetorno
				);

				this.actualizaTotales();
			});
	}

	/**
	 * Lee el archivo txt cargado. Debe cumplir:
	 * - Debe tener extensión txt.
	 * - Debe ser del tipo MTC1R999, extraído del SOL
	 * @param txt Archivo txt cargado a Gacela.
	 * @returns El detalle del archivo cargado.
	 */
	private leerTxt(txt: any) {
		let detalles: FileDetMTC1R999[] = [];

		let lines = txt.toString().split('\n');

		// REMUEVE LAS LINEAS sin valor (primeras y ultimas)
		lines = lines.slice(10, lines.length - 2);

		let idItem = 0;

		lines.forEach(line => {
			let det = new FileDetMTC1R999();
			let posActual = 0;

			let t_depot = 6;
			let t_vsl_voy_s = 18;
			let t_booking_no = 16;
			let t_rvs = 3;
			let t_qty = 3;
			let t_pick = 4;
			let t_balance = 7;
			let t_mode = 4;
			let t_mta = 3;
			let t_tpe = 3;
			let t_rct = 5;
			let t_pol = 5;
			let t_pod = 5;
			let t_dly = 5;
			let t_release = 8;
			let t_cut_off = 8;
			let t_dry_use = 7;
			let t_pre_cool = 8;
			let t_temp = 8;
			let t_vent = 4;
			let t_commodity = 40;
			let t_special_handling = 40;
			let t_customer_ac = 12;
			let t_customer_name = 40;
			let t_remark = 20;

			idItem = idItem + 1;

			det.idItem = idItem;
			det.depot = line.substr(posActual, t_depot).trim();
			posActual = posActual + t_depot + 1;
			det.vsl_voy_s = line.substr(posActual, t_vsl_voy_s).trim();
			posActual = posActual + t_vsl_voy_s + 1;
			det.booking_no = line.substr(posActual, t_booking_no).trim();
			posActual = posActual + t_booking_no + 1;
			det.rvs = line.substr(posActual, t_rvs).trim();
			posActual = posActual + t_rvs + 1;
			det.qty = Number(line.substr(posActual, t_qty).trim());
			posActual = posActual + t_qty + 1;
			det.pick = Number(line.substr(posActual, t_pick).trim());
			posActual = posActual + t_pick + 1;
			det.balance = Number(line.substr(posActual, t_balance).trim());
			posActual = posActual + t_balance + 1;
			det.mode = line.substr(posActual, t_mode).trim();
			posActual = posActual + t_mode + 1;
			det.mta = line.substr(posActual, t_mta).trim();
			posActual = posActual + t_mta + 1;
			det.tpe = line.substr(posActual, t_tpe).trim();
			posActual = posActual + t_tpe + 1;
			det.rct = line.substr(posActual, t_rct).trim();
			posActual = posActual + t_rct + 1;
			det.pol = line.substr(posActual, t_pol).trim();
			posActual = posActual + t_pol + 1;
			det.pod = line.substr(posActual, t_pod).trim();
			posActual = posActual + t_pod + 1;
			det.dly = line.substr(posActual, t_dly).trim();
			posActual = posActual + t_dly + 1;

			let release_aux = line.substr(posActual, t_release).trim();
			det.release = new Date(
				Number(release_aux.substr(0, 4)),
				Number(release_aux.substr(4, 2)) - 1,
				Number(release_aux.substr(6, 2))
			);
			posActual = posActual + t_release + 1;

			let cut_off_aux = line.substr(posActual, t_cut_off).trim();
			det.cut_off = new Date(
				Number(cut_off_aux.substr(0, 4)),
				Number(cut_off_aux.substr(4, 2)) - 1,
				Number(cut_off_aux.substr(6, 2))
			);
			posActual = posActual + t_cut_off + 1;

			det.dry_use = line.substr(posActual, t_dry_use).trim();
			posActual = posActual + t_dry_use + 1;
			det.pre_cool = line.substr(posActual, t_pre_cool).trim();
			posActual = posActual + t_pre_cool + 1;
			det.temp = line.substr(posActual, t_temp).trim();
			posActual = posActual + t_temp + 1;
			det.vent = Number(line.substr(posActual, t_vent).trim());
			posActual = posActual + t_vent + 1;
			det.commodity = line.substr(posActual, t_commodity).trim();
			posActual = posActual + t_commodity + 1;
			det.special_handling = line.substr(posActual, t_special_handling).trim();
			posActual = posActual + t_special_handling + 1;
			det.customer_ac = line.substr(posActual, t_customer_ac).trim();
			posActual = posActual + t_customer_ac + 1;
			det.customer_name = line.substr(posActual, t_customer_name).trim();
			posActual = posActual + t_customer_name + 1;
			det.remark = line.substr(posActual, t_remark).trim();
			posActual = posActual + t_remark + 1;

			det.nave = det.vsl_voy_s.split('/')[0].trim();
			det.viaje = det.vsl_voy_s.split('/')[1].trim();

			detalles.push(det);
		});

		return detalles;
	}

	/**
	 * Obtiene el listado de naves que existen en el archivo pero no en la BD.
	 * @param detalle Obtenido del archivo leido.
	 * @param naves Lista de Naves obtenidas de la BD.
	 * @returns Lista de naves no registradas en la BD.
	 */
	private obtieneNavesNoRegistradas(detalle: Array<FileDetMTC1R999>, naves: Array<Nave>): any[] {
		let navesNoRegistradas: any[] = [];

		for (let d of detalle) {
			if (naves.filter(n => d.nave === n.alNave).length === 0) {
				navesNoRegistradas.push(d.nave);
			}
		}

		// ELIMINA DUPLICADOS
		navesNoRegistradas = navesNoRegistradas.filter(
			(valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual
		);

		return navesNoRegistradas;
	}

	/**
	 * Consulta y permite seleccionar una nave a partir del maestro de naves de la BD.
	 * Llama una ventana dialog que muestra el maestro de naves.
	 * @returns El código de la nave seleccionada.
	 */
	async getNave() {
		const promesa = await new Promise((resolve, reject) => {
			const dialogRef = this.dialog.open(DialogListarNavesComponent, {
				width: '1000px',
				height: '800px',
			});

			dialogRef.afterClosed().subscribe((alNave: string) => {
				if (!alNave) {
					let error = new Error('No seleccionó ninguna nave...');
					reject(error);
				}

				resolve(alNave);
			});
		});

		return promesa;
	}

	/**
	 * Validación de los RPO en conjunto, valida a nivel de registro (3 montos al mismo tiempo):
	 * - Valida que el ETA no sea mayor que 3 días.
	 * - si los montos son negativos, el ETA debe ser igual a hoy.
	 * @param index Índice para identificar el registro del RPO
	 */
	validaRpo(index: number): string {
		let fecha = this.forma.controls['rpoPlan']['controls'][index]['controls'].etaRpo.value;
		let ca2SdRpo = Number(this.forma.controls['rpoPlan']['controls'][index]['controls'].ca2SdRpo.value);
		let ca4SdRpo = Number(this.forma.controls['rpoPlan']['controls'][index]['controls'].ca4SdRpo.value);
		let ca4ShRpo = Number(this.forma.controls['rpoPlan']['controls'][index]['controls'].ca4ShRpo.value);

		let etaRpo = new Date(fecha.substr(0, 4), fecha.substr(5, 2) - 1, fecha.substr(8, 2));

		if ((this.today.getTime() - etaRpo.getTime()) / 1000 / 60 / 60 / 24 >= 3) {
			this.forma.controls['rpoPlan']['controls'][index]['controls'].fgActiRpo.setValue('D');

			this.forma.controls['rpoPlan']['controls'][index]['controls'].ca2SdRpo.setValue(0);
			this.forma.controls['rpoPlan']['controls'][index]['controls'].ca4SdRpo.setValue(0);
			this.forma.controls['rpoPlan']['controls'][index]['controls'].ca4ShRpo.setValue(0);

			this.actualizaTotales();

			return 'D';
		} else if (
			ca2SdRpo <= 0 &&
			ca4SdRpo <= 0 &&
			ca4ShRpo <= 0 &&
			(this.today.getTime() - etaRpo.getTime()) / 1000 / 60 / 60 / 24 > 0
		) {
			this.forma.controls['rpoPlan']['controls'][index]['controls'].fgActiRpo.setValue('D');
			this.forma.controls['rpoPlan']['controls'][index]['controls'].ca2SdRpo.setValue(0);
			this.forma.controls['rpoPlan']['controls'][index]['controls'].ca4SdRpo.setValue(0);
			this.forma.controls['rpoPlan']['controls'][index]['controls'].ca4ShRpo.setValue(0);

			this.actualizaTotales();
			return 'D';
		} else {
			this.forma.controls['rpoPlan']['controls'][index]['controls'].fgActiRpo.setValue('A');

			this.actualizaTotales();
			return 'A';
		}
	}

	/**
	 * Validación del monto 2SD RPO de forma particular,
	 * en caso de no cumplir con la condición, el monto lo iguala a 0.
	 * @param index Índice para identificar el registro RPO
	 */
	ca2SdRpoValido(index: number) {
		let ca2SdRpo = Number(this.forma.controls['rpo']['controls'][index]['controls'].ca2SdRpo.value);

		let fecha = this.forma.controls['rpo']['controls'][index]['controls'].etaRpo.value;
		let etaRpo = new Date(fecha.substr(0, 4), fecha.substr(5, 2) - 1, fecha.substr(8, 2));

		if (ca2SdRpo < 0 && (this.today.getTime() - etaRpo.getTime()) / 1000 / 60 / 60 / 24 > 0) {
			this.forma.controls['rpo']['controls'][index]['controls'].ca2SdRpo.setValue(0);
		}

		this.actualizaTotales();
	}

	/**
	 * Validación del monto 4SD RPO de forma particular,
	 * en caso de no cumplir con la condición, iguala el monto a 0.
	 * @param index Índice para identificar el registro RPO.
	 */
	ca4SdRpoValido(index: number) {
		let ca4SdRpo = Number(this.forma.controls['rpo']['controls'][index]['controls'].ca4SdRpo.value);

		let fecha = this.forma.controls['rpo']['controls'][index]['controls'].etaRpo.value;
		let etaRpo = new Date(fecha.substr(0, 4), fecha.substr(5, 2) - 1, fecha.substr(8, 2));

		if (ca4SdRpo < 0 && (this.today.getTime() - etaRpo.getTime()) / 1000 / 60 / 60 / 24 > 0) {
			this.forma.controls['rpo']['controls'][index]['controls'].ca4SdRpo.setValue(0);
		}

		this.actualizaTotales();
	}

	/**
	 * Validación de 4SH RPO de forma particular,
	 * en caso de no cumplir con la condición, iguala el monto a 0.
	 * @param index Índice para identificar el registro RPO.
	 */
	ca4ShRpoValido(index: number) {
		let ca4ShRpo = Number(this.forma.controls['rpo']['controls'][index]['controls'].ca4ShRpo.value);

		let fecha = this.forma.controls['rpo']['controls'][index]['controls'].etaRpo.value;
		let etaRpo = new Date(fecha.substr(0, 4), fecha.substr(5, 2) - 1, fecha.substr(8, 2));

		if (ca4ShRpo < 0 && (this.today.getTime() - etaRpo.getTime()) / 1000 / 60 / 60 / 24 > 0) {
			this.forma.controls['rpo']['controls'][index]['controls'].ca4ShRpo.setValue(0);
		}

		this.actualizaTotales();
	}

	private isRatioDisponible(): boolean {
		let todayAux: Date = new Date(this.today.getTime());
		let ultimoLunes = new Date(todayAux.setDate(todayAux.getDate() - (todayAux.getDay() - 1)));

		if (this.today.getDay() === 1) {
			return true;
		} else if ((ultimoLunes.getTime() - this.ratioDevolucion.feModi.getTime()) / 1000 / 60 / 60 / 24 > 0) {
			return true;
		} else {
			return false;
		}
	}

	//#endregion UTILITARIOS
}
