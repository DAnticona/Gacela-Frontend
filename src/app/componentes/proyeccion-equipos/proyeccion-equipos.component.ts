import { Component } from '@angular/core';
import { ParamsService } from '../../servicios/params.service';
import { ProyeccionVentaCab } from '../../modelos/proyeccion-venta-cab.model';
import { RatioDevolucion } from '../../modelos/ratio-devolucion.model';
import { FileMTC1R999Cab } from '../../modelos/file-mtc1r999-cab.model';
import { ProyeccionService } from '../../servicios/proyeccion-venta.service';
import { ProyeccionEquipoCab } from 'src/app/modelos/proyeccion-equipo-cab.model';
import { ProyeccionEquipoDet } from 'src/app/modelos/proyeccion-equipo-det.model';
import { CalendarioService } from '../../servicios/calendario.service';
import { DatePipe } from '@angular/common';
import { RpoPlan } from '../../models/rpoPlan.model';
import { ProyeccionEquiposStocks } from '../../modelos/proyeccion-equipos-stocks.model';

/**
 * Controla la generación de la proyección de equipos.
 * Trae datos de los siguientes componentes:
 * - FileMtc1r999: Datos del archivo SOL activo.
 * - ProyeccionVentas: Proyección de ventas activa.
 * - RatioDevolucion: Ratios de devolución registrados.
 * - ProyeccionEquiposStock: Stock para la proyección.
 * -
 *
 * Envía los datos al componente ProyeccionEquiposDetalles.
 * - Autor: David Anticona - <danticona@wollcorp.com>
 * - Creado el: 16/04/2020
 */
@Component({
	selector: 'app-proyeccion-equipos',
	templateUrl: './proyeccion-equipos.component.html',
	styleUrls: ['./proyeccion-equipos.component.css'],
	providers: [DatePipe],
})
export class ProyeccionEquiposComponent {
	/**
	 * Variable que almacena las rutas para la conexión con el backend
	 */
	private urls: any;

	/**
	 * Variable que almacena el token otorgado del backend
	 */
	private token: string;

	/**
	 * Variable que almacena la proyección de equipos generada.
	 */
	protected proyeccionEquipo: ProyeccionEquipoCab;

	/**
	 * Variable que almacena los Planes RPO
	 */
	protected rpoPlan = new Array<RpoPlan>();

	/**
	 * Variable que almacena los ratios de devolución.
	 */
	protected ratioDevolucion = new RatioDevolucion();

	/**
	 * Variable que almacena el archivo Mtc1r999 activo.
	 */
	protected fileMtc1r999 = new FileMTC1R999Cab();

	/**
	 * Variable que controla si se muestra la proyección de equipos o la ventas.
	 */
	protected muestraSol = true;

	/**
	 * Variable que almacena el resumen generado desde la BD
	 */
	protected resumen: any[] = [];

	/**
	 * Variable que almacena la fecha de hoy
	 */
	protected today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

	/**
	 * Variable que almacena los datos de la proyección generada por el equipo de ventas.
	 */
	public proyeccionVenta = new ProyeccionVentaCab();
	public proyeccionVentaFinal: ProyeccionEquipoCab;

	/**
	 * Variable que almacena los stocks de la proyección de equipos.
	 */
	public stock = new ProyeccionEquiposStocks();

	/**
	 * Variable que controla si se hizo click en el boton proyeccionGenerada.
	 */
	public generar = false;

	/**
	 * Variable que controla el estado de la página, si esta cargando algun componente.
	 */
	public cargando = false;

	/**
	 * Variable que controla el estado del componente FileMtc1r999
	 */
	public cargandoFile = false;

	/**
	 * Variable que controla el estado del componente RatioDevolucion
	 */
	public cargandoRatio = false;

	/**
	 * Variable que controla el estado del componente ProyeccionVentaActiva
	 */
	public cargandoProyVenta = false;

	/**
	 * Variable que controla el estado del componente RpoPlan
	 */
	public cargandoRpoPlan = false;

	/**
	 * Variable que controla el estado del componente ProyeccionDetalle
	 */
	public cargandoExportar = false;

	constructor(
		private paramService: ParamsService,
		private proyeccionService: ProyeccionService,
		private calendarioService: CalendarioService,
		private datepipe: DatePipe
	) {
		this.urls = this.paramService.urls;
		this.token = this.paramService.conexion.token;
	}

	/**
	 * Método que se emite desde el componente ProyeccionVentaActiva,
	 * Trae la proyección de ventas desde la BD.
	 * Es necesario volver a generar la proyeccion
	 * @param event Es el valor retornado desde el componente (proyección de ventas)
	 */
	public traeProyeccionVenta(event) {
		if (event) {
			this.proyeccionVenta = event;
		} else {
			this.proyeccionVenta = null;
		}
		this.generar = false;
	}

	/**
	 * Método que se emite desde el componente ProyeccionVentaActiva,
	 * trae el estado del componente.
	 * @param event Es el estado del componente.
	 */
	public traeCargandoProyVenta(event) {
		this.cargandoProyVenta = event;
	}

	/**
	 * Método que se emite desde el componente RatioDevolucion,
	 * trae los ratios de devolución desde la BD.
	 * Es necesario volver a generar la proyeccion
	 * @param event Es el valor de retorno del componente (Ratio de devolución)
	 */
	public traeRatioDevolucion(event) {
		if (event) {
			this.ratioDevolucion = event;
		} else {
			this.ratioDevolucion = null;
		}
		this.generar = false;
	}

	/**
	 * Método que se emite desde el componente RatioDEvolucion,
	 * trae el estado del componente
	 * @param event Es el estado del componente.
	 */
	public traeCargandoRatio(event) {
		this.cargandoRatio = event;
	}

	/**
	 * Método que se emite desde el componente FileMtc1r999,
	 * trae el último archivo MTC1R999.
	 * Es necesario volver a generar la proyeccion
	 * @param event Es el valor de retorno del componente (File MTC1R999)
	 */
	public traeFileMtc1r999(event) {
		if (event) {
			this.fileMtc1r999 = event;
		} else {
			this.fileMtc1r999 = null;
		}
		this.generar = false;
	}

	/**
	 * Método que se emite desde el componente FileMtc1r999,
	 * trae el estado del componente.
	 * @param event Es el estado del componente.
	 */
	public traeCargandoFile(event) {
		this.cargandoFile = event;
	}

	/**
	 * Método que se emite desde el componente DialogRegistroRpoPlan,
	 * trae los planes RPO registrados en base de datos.
	 * Es necesario volver a generar la proyeccion
	 * @param event Son los planes RPO obtenidos de la base de datos
	 */
	public traeRpoPlan(event) {
		if (event) {
			this.rpoPlan = event;
		} else {
			this.rpoPlan = null;
		}
		this.generar = false;
	}

	/**
	 * Método que se emite desde el componente DialogRegistroRpoPlan,
	 * trae el estado del componente si esta cargando o no.
	 * @param event Es el estado del componente hijo.
	 */
	public traeCargandoRpoPlan(event) {
		this.cargandoRpoPlan = event;
	}

	/**
	 * Método que se emite desde el componente ProyeccionEquiposStocks,
	 * trae los stocks ingresados.
	 * NO es necesario volver a generar la proyeccion.
	 * @param event Es el stock ingresado en el componente.
	 */
	public traeStocks(event) {
		this.stock = new ProyeccionEquiposStocks();
		if (event) {
			this.stock = event;
		} else {
			this.stock = null;
		}
	}

	public traeCargandoExportar(event) {
		this.cargandoExportar = event;
	}

	/**
	 * Método lanzado al hacer click en el boton "Generar Proyeccion".
	 * Muestra la proyección de ventas y esquipos
	 */
	public generaProyeccionEquipos() {
		this.cargando = true;
		this.generar = false;

		let proyeccionEquipo = new ProyeccionEquipoCab();
		let proyeccionVenta = new ProyeccionEquipoCab();

		this.proyeccionService
			.generaResumenProyeccion(this.token, this.urls, this.fileMtc1r999.coFile)
			.subscribe((res: any) => {
				this.resumen = res.body.proyeccionGenerada;

				proyeccionEquipo = this.iniciaDatosCabecera(proyeccionEquipo);

				proyeccionEquipo = this.resumenToDetalle(this.resumen, proyeccionEquipo);

				proyeccionEquipo.ratio2Sd = this.ratioDevolucion.ratio2Sd;
				proyeccionEquipo.ratio4Sd = this.ratioDevolucion.ratio4Sd;
				proyeccionEquipo.ratio4Sh = this.ratioDevolucion.ratio4Sh;
				proyeccionEquipo.nroDiasHabiles = 24;

				let lastEta = new Date(proyeccionEquipo.detalles[proyeccionEquipo.detalles.length - 1].eta.getTime());

				proyeccionEquipo.feEmptyReturn = new Date(
					lastEta.getFullYear(),
					lastEta.getMonth(),
					lastEta.getDate() - 7
				);

				let fechaIni = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
				let fechaFin = new Date(
					proyeccionEquipo.detalles[proyeccionEquipo.detalles.length - 1].eta.getTime()
				);

				this.calendarioService
					.getCalendario(
						this.token,
						this.urls,
						this.datepipe.transform(fechaIni, 'yyyy-MM-dd'),
						this.datepipe.transform(fechaFin, 'yyyy-MM-dd')
					)
					.subscribe(res2 => {
						let calendario = res2.body.calendario;

						proyeccionEquipo.nroDiasAlRetorno = calendario.filter(
							c =>
								c.fecha.getTime() > this.today.getTime() &&
								c.fecha.getTime() <= lastEta &&
								c.fgFeriado === 'N'
						).length;

						proyeccionEquipo.ca2SdEmptyRet = Math.round(
							(proyeccionEquipo.ratio2Sd / proyeccionEquipo.nroDiasHabiles) *
								proyeccionEquipo.nroDiasAlRetorno
						);
						proyeccionEquipo.ca4SdEmptyRet = Math.round(
							(proyeccionEquipo.ratio4Sd / proyeccionEquipo.nroDiasHabiles) *
								proyeccionEquipo.nroDiasAlRetorno
						);
						proyeccionEquipo.ca4ShEmptyRet = Math.round(
							(proyeccionEquipo.ratio4Sh / proyeccionEquipo.nroDiasHabiles) *
								proyeccionEquipo.nroDiasAlRetorno
						);

						for (let p of this.rpoPlan) {
							let detalle = new ProyeccionEquipoDet();

							detalle.idItem = proyeccionEquipo.detalles.length + 1;
							detalle.alNave = p.alNaveRpo;
							detalle.viaje = p.viajeRpo;
							detalle.eta = p.etaRpo;
							detalle.fgRpoPlan = 'S';
							detalle.caRpo2Sd = p.ca2SdRpo;
							detalle.caRpo4Sd = p.ca4SdRpo;
							detalle.caRpo4Sh = p.ca4ShRpo;

							proyeccionEquipo.detalles.push(detalle);
						}

						proyeccionEquipo = this.calcularAvailables(proyeccionEquipo);

						if (this.proyeccionVenta) {
							this.iniciaProyeccionVentas(proyeccionEquipo);
						} else {
							this.proyeccionVentaFinal = null;
							this.proyeccionEquipo = proyeccionEquipo;
							this.generar = true;
							this.cargando = false;
						}
					});
			});
	}

	/**
	 * Método que obtiene los datos de la cabecera de la proyección.
	 * Los datos de stock son gestionados de forma independiente, por eso
	 * no se declaran en este método.
	 */
	private iniciaDatosCabecera(proyeccionEquipo: ProyeccionEquipoCab): ProyeccionEquipoCab {
		proyeccionEquipo.coTiProy = 'DR';
		proyeccionEquipo.coProyEqui = null;
		proyeccionEquipo.coFile = this.fileMtc1r999.coFile;

		if (this.proyeccionVenta) {
			proyeccionEquipo.coProyVenta = this.proyeccionVenta.coProyeccion;
		} else {
			proyeccionEquipo.coProyVenta = null;
		}

		proyeccionEquipo.feCrea = this.today;
		proyeccionEquipo.nroSem = 0;

		return proyeccionEquipo;
	}

	/**
	 * Genera la proyección de equipos a partir del resumen obtenido desde la BD.
	 * - Obtiene el detalle de la proyección ordenado por ETA
	 * - Calcula totales iniciales de la proyección de equipos
	 * @param resumen Resumen obtenido desde la BD
	 * @returns Proyección generada a partir del resumen.
	 */
	private resumenToDetalle(resumen: any[], proyeccionEquipo: ProyeccionEquipoCab): ProyeccionEquipoCab {
		proyeccionEquipo.detalles = new Array<ProyeccionEquipoDet>();
		resumen.forEach(p => {
			if (
				proyeccionEquipo.detalles.filter(
					d => d.alNave === p.alNave && d.viaje === p.viaje && d.eta.getTime() === p.eta.getTime()
				).length === 0
			) {
				let det = new ProyeccionEquipoDet();

				det.idItem = proyeccionEquipo.detalles.length + 1;
				det.alNave = p.alNave;
				det.viaje = p.viaje;
				det.eta = p.eta;

				proyeccionEquipo.detalles.push(det);
			}
		});

		for (let d of proyeccionEquipo.detalles) {
			d.fgRpoPlan = 'N';
			d.ca2SdFe = 0;
			d.ca2SdFePick = 0;
			d.ca2SdNoFe = 0;
			d.ca2SdNoFePick = 0;
			d.ca4SdFe = 0;
			d.ca4SdFePick = 0;
			d.ca4SdNoFe = 0;
			d.ca4SdNoFePick = 0;
			d.ca4ShFe = 0;
			d.ca4ShFePick = 0;
			d.ca4ShNoFe = 0;
			d.ca4ShNoFePick = 0;
		}

		proyeccionEquipo.detalles.forEach(d => {
			resumen
				.filter(f => f.alNave === d.alNave && f.viaje === d.viaje && f.eta.getTime() === d.eta.getTime())
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
					}
				});
		});

		proyeccionEquipo.detalles.sort((a, b) => new Date(a.eta).getTime() - new Date(b.eta).getTime());

		proyeccionEquipo.to2SdFe = 0;
		proyeccionEquipo.to2SdNoFe = 0;
		proyeccionEquipo.to4SdNoFe = 0;
		proyeccionEquipo.to4SdFe = 0;
		proyeccionEquipo.to4ShNoFe = 0;
		proyeccionEquipo.to4ShFe = 0;
		proyeccionEquipo.to2SdNoFePick = 0;
		proyeccionEquipo.to2SdFePick = 0;
		proyeccionEquipo.to4SdNoFePick = 0;
		proyeccionEquipo.to4SdFePick = 0;
		proyeccionEquipo.to4ShNoFePick = 0;
		proyeccionEquipo.to4ShFePick = 0;

		for (let d of proyeccionEquipo.detalles) {
			proyeccionEquipo.to2SdFe += d.ca2SdFe;
			proyeccionEquipo.to2SdNoFe += d.ca2SdNoFe;
			proyeccionEquipo.to4SdFe += d.ca4SdFe;
			proyeccionEquipo.to4SdNoFe += d.ca4SdNoFe;
			proyeccionEquipo.to4ShFe += d.ca4ShFe;
			proyeccionEquipo.to4ShNoFe += d.ca4ShNoFe;
			proyeccionEquipo.to2SdFePick += d.ca2SdFePick;
			proyeccionEquipo.to2SdNoFePick += d.ca2SdNoFePick;
			proyeccionEquipo.to4SdFePick += d.ca4SdFePick;
			proyeccionEquipo.to4SdNoFePick += d.ca4SdNoFePick;
			proyeccionEquipo.to4ShFePick += d.ca4ShFePick;
			proyeccionEquipo.to4ShNoFePick += d.ca4ShNoFePick;
		}

		proyeccionEquipo.to2SdBook = proyeccionEquipo.to2SdFe + proyeccionEquipo.to2SdNoFe;
		proyeccionEquipo.to4SdBook = proyeccionEquipo.to4SdFe + proyeccionEquipo.to4SdNoFe;
		proyeccionEquipo.to4ShBook = proyeccionEquipo.to4ShFe + proyeccionEquipo.to4ShNoFe;

		proyeccionEquipo.to2SdPick = proyeccionEquipo.to2SdFePick + proyeccionEquipo.to2SdNoFePick;
		proyeccionEquipo.to4SdPick = proyeccionEquipo.to4SdFePick + proyeccionEquipo.to4SdNoFePick;
		proyeccionEquipo.to4ShPick = proyeccionEquipo.to4ShFePick + proyeccionEquipo.to4ShNoFePick;

		return proyeccionEquipo;
	}

	/**
	 * Método auxiliar que calcula los totales de la proyección de equipos.
	 * Este método es llamado una vez que la proyección ha sido generada.
	 */
	private calcularAvailables(proyeccionEquipo: ProyeccionEquipoCab): ProyeccionEquipoCab {
		proyeccionEquipo.available2Sd =
			proyeccionEquipo.to2SdPick - proyeccionEquipo.to2SdBook + proyeccionEquipo.ca2SdEmptyRet;
		proyeccionEquipo.available4Sd =
			proyeccionEquipo.to4SdPick - proyeccionEquipo.to4SdBook + proyeccionEquipo.ca4SdEmptyRet;
		proyeccionEquipo.available4Sh =
			proyeccionEquipo.to4ShPick - proyeccionEquipo.to4ShBook + proyeccionEquipo.ca4ShEmptyRet;

		let rpoPlan = proyeccionEquipo.detalles.filter(r => r.fgRpoPlan === 'S');
		for (let rpo of rpoPlan) {
			proyeccionEquipo.available2Sd += rpo.caRpo2Sd;
			proyeccionEquipo.available4Sd += rpo.caRpo4Sd;
			proyeccionEquipo.available4Sh += rpo.caRpo4Sh;
		}

		return proyeccionEquipo;
	}

	public iniciaProyeccionVentas(proyeccionEquipo: ProyeccionEquipoCab) {
		let proyeccionVenta = new ProyeccionEquipoCab();

		proyeccionVenta.coProyEqui = this.proyeccionVenta.coProyeccion;
		proyeccionVenta.coTiProy = this.proyeccionVenta.tipo;
		proyeccionVenta.feProy = this.proyeccionVenta.feProyeccion;
		proyeccionVenta.fgActi = this.proyeccionVenta.fgActi;
		proyeccionVenta.nroSem = this.proyeccionVenta.nroSem;
		proyeccionVenta.coFile = this.proyeccionVenta.coFile;

		proyeccionVenta.detalles = new Array<ProyeccionEquipoDet>();

		this.proyeccionVenta.detalles = this.proyeccionVenta.detalles.filter(
			p => p.eta.getTime() > this.today.getTime()
		);

		for (let d of this.proyeccionVenta.detalles) {
			let df = new ProyeccionEquipoDet();

			df.idItem = proyeccionVenta.detalles.length + 1;
			df.alNave = d.alNave;
			df.viaje = d.viaje;
			df.eta = d.eta;
			df.fgRpoPlan = 'N';

			// Verifica coinciencias entre proyecciones ventas y equipos
			let eDet = proyeccionEquipo.detalles.filter(
				ed => ed.alNave === d.alNave && ed.viaje === d.viaje && ed.eta.getTime() === d.eta.getTime()
			);

			// Si existen coincidencias, entonces si txt es mayor prevalece txt sino ventas
			if (eDet.length > 0 && eDet[0].fgRpoPlan === 'N') {
				// Existe en equipos

				if (eDet[0].ca2SdNoFe > d.ca2SdNoFe) {
					df.ca2SdNoFe = eDet[0].ca2SdNoFe;
				} else {
					df.ca2SdNoFe = d.ca2SdNoFe;
				}

				if (eDet[0].ca2SdFe > d.ca2SdFe) {
					df.ca2SdFe = eDet[0].ca2SdFe;
				} else {
					df.ca2SdFe = d.ca2SdFe;
				}

				if (eDet[0].ca4SdNoFe > d.ca4SdNoFe) {
					df.ca4SdNoFe = eDet[0].ca4SdNoFe;
				} else {
					df.ca4SdNoFe = d.ca4SdNoFe;
				}

				if (eDet[0].ca4SdFe > d.ca4SdFe) {
					df.ca4SdFe = eDet[0].ca4SdFe;
				} else {
					df.ca4SdFe = d.ca4SdFe;
				}

				if (eDet[0].ca4ShNoFe > d.ca4ShNoFe) {
					df.ca4ShNoFe = eDet[0].ca4ShNoFe;
				} else {
					df.ca4ShNoFe = d.ca4ShNoFe;
				}

				if (eDet[0].ca4ShFe > d.ca4ShFe) {
					df.ca4ShFe = eDet[0].ca4ShFe;
				} else {
					df.ca4ShFe = d.ca4ShFe;
				}

				df.ca2SdNoFePick = eDet[0].ca2SdNoFePick;
				df.ca2SdFePick = eDet[0].ca2SdFePick;
				df.ca4SdNoFePick = eDet[0].ca4SdNoFePick;
				df.ca4SdFePick = eDet[0].ca4SdFePick;
				df.ca4ShNoFePick = eDet[0].ca4ShNoFePick;
				df.ca4ShFePick = eDet[0].ca4ShFePick;
			} else {
				df.ca2SdNoFe = d.ca2SdNoFe;
				df.ca2SdFe = d.ca2SdFe;
				df.ca4SdNoFe = d.ca4SdNoFe;
				df.ca4SdFe = d.ca4SdFe;
				df.ca4ShNoFe = d.ca4ShNoFe;
				df.ca4ShFe = d.ca4ShFe;
				df.ca2SdNoFePick = d.ca2SdNoFePick;
				df.ca2SdFePick = d.ca2SdFePick;
				df.ca4SdNoFePick = d.ca4SdNoFePick;
				df.ca4SdFePick = d.ca4SdFePick;
				df.ca4ShNoFePick = d.ca4ShNoFePick;
				df.ca4ShFePick = d.ca4ShFePick;
			}

			proyeccionVenta.detalles.push(df);
		}

		// Verifica si existen naves en txt que no este en ventas
		for (let ed of proyeccionEquipo.detalles) {
			let vDet = proyeccionVenta.detalles.filter(
				v => v.alNave === ed.alNave && v.viaje === ed.viaje && v.eta.getTime() === ed.eta.getTime()
			);

			// Si existen, las agrega
			if (vDet.length === 0 && ed.fgRpoPlan === 'N') {
				let df = new ProyeccionEquipoDet();

				df.idItem = proyeccionVenta.detalles.length + 1;
				df.alNave = ed.alNave;
				df.viaje = ed.viaje;
				df.eta = ed.eta;
				df.fgRpoPlan = 'N';
				df.ca2SdNoFe = ed.ca2SdNoFe;
				df.ca2SdFe = ed.ca2SdFe;
				df.ca4SdNoFe = ed.ca4SdNoFe;
				df.ca4SdFe = ed.ca4SdFe;
				df.ca4ShNoFe = ed.ca4ShNoFe;
				df.ca4ShFe = ed.ca4ShFe;
				df.ca2SdNoFePick = ed.ca2SdNoFePick;
				df.ca2SdFePick = ed.ca2SdFePick;
				df.ca4SdNoFePick = ed.ca4SdNoFePick;
				df.ca4SdFePick = ed.ca4SdFePick;
				df.ca4ShNoFePick = ed.ca4ShNoFePick;
				df.ca4ShFePick = ed.ca4ShFePick;

				proyeccionVenta.detalles.push(df);
			}
		}

		proyeccionVenta.detalles.sort((a, b) => new Date(a.eta).getTime() - new Date(b.eta).getTime());

		proyeccionVenta = this.calculaTotalVentas(proyeccionVenta);

		proyeccionVenta.ratio2Sd = this.ratioDevolucion.ratio2Sd;
		proyeccionVenta.ratio4Sd = this.ratioDevolucion.ratio4Sd;
		proyeccionVenta.ratio4Sh = this.ratioDevolucion.ratio4Sh;
		proyeccionVenta.nroDiasHabiles = 24;

		let lastEta = new Date(proyeccionVenta.detalles[proyeccionVenta.detalles.length - 1].eta.getTime());

		proyeccionVenta.feEmptyReturn = new Date(
			lastEta.getFullYear(),
			lastEta.getMonth(),
			lastEta.getDate() - 7
		);

		let fechaIni = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
		let fechaFin = new Date(proyeccionVenta.detalles[proyeccionVenta.detalles.length - 1].eta.getTime());

		this.calendarioService
			.getCalendario(
				this.token,
				this.urls,
				this.datepipe.transform(fechaIni, 'yyyy-MM-dd'),
				this.datepipe.transform(fechaFin, 'yyyy-MM-dd')
			)
			.subscribe(res3 => {
				let cal = res3.body.calendario;

				proyeccionVenta.nroDiasAlRetorno = cal.filter(
					c => c.fecha.getTime() > this.today.getTime() && c.fecha.getTime() <= lastEta && c.fgFeriado === 'N'
				).length;

				proyeccionVenta.ca2SdEmptyRet = Math.round(
					(proyeccionVenta.ratio2Sd / proyeccionVenta.nroDiasHabiles) * proyeccionVenta.nroDiasAlRetorno
				);
				proyeccionVenta.ca4SdEmptyRet = Math.round(
					(proyeccionVenta.ratio4Sd / proyeccionVenta.nroDiasHabiles) * proyeccionVenta.nroDiasAlRetorno
				);
				proyeccionVenta.ca4ShEmptyRet = Math.round(
					(proyeccionVenta.ratio4Sh / proyeccionVenta.nroDiasHabiles) * proyeccionVenta.nroDiasAlRetorno
				);

				for (let p of this.rpoPlan) {
					let detalle = new ProyeccionEquipoDet();

					detalle.idItem = proyeccionVenta.detalles.length + 1;
					detalle.alNave = p.alNaveRpo;
					detalle.viaje = p.viajeRpo;
					detalle.eta = p.etaRpo;
					detalle.fgRpoPlan = 'S';
					detalle.caRpo2Sd = p.ca2SdRpo;
					detalle.caRpo4Sd = p.ca4SdRpo;
					detalle.caRpo4Sh = p.ca4ShRpo;

					proyeccionVenta.detalles.push(detalle);
				}
				this.proyeccionVentaFinal = proyeccionVenta;
				this.proyeccionEquipo = proyeccionEquipo;
				this.generar = true;
				this.cargando = false;
			});
	}

	public calculaTotalVentas(proyeccionVenta: ProyeccionEquipoCab): ProyeccionEquipoCab {
		let to2SdNoFe = 0;
		let to2SdFe = 0;
		let to4SdNoFe = 0;
		let to4SdFe = 0;
		let to4ShNoFe = 0;
		let to4ShFe = 0;

		let to2SdNoFePick = 0;
		let to2SdFePick = 0;
		let to4SdNoFePick = 0;
		let to4SdFePick = 0;
		let to4ShNoFePick = 0;
		let to4ShFePick = 0;

		for (let pvd of proyeccionVenta.detalles) {
			to2SdNoFe += pvd.ca2SdNoFe;
			to2SdFe += pvd.ca2SdFe;
			to4SdNoFe += pvd.ca4SdNoFe;
			to4SdFe += pvd.ca4SdFe;
			to4ShNoFe += pvd.ca4ShNoFe;
			to4ShFe += pvd.ca4ShFe;

			to2SdNoFePick += pvd.ca2SdNoFePick;
			to2SdFePick += pvd.ca2SdFePick;
			to4SdNoFePick += pvd.ca4SdNoFePick;
			to4SdFePick += pvd.ca4SdFePick;
			to4ShNoFePick += pvd.ca4ShNoFePick;
			to4ShFePick += pvd.ca4ShFePick;
		}

		proyeccionVenta.to2SdNoFe = to2SdNoFe;
		proyeccionVenta.to2SdFe = to2SdFe;
		proyeccionVenta.to4SdNoFe = to4SdNoFe;
		proyeccionVenta.to4SdFe = to4SdFe;
		proyeccionVenta.to4ShNoFe = to4ShNoFe;
		proyeccionVenta.to4ShFe = to4ShFe;

		proyeccionVenta.to2SdNoFePick = to2SdNoFePick;
		proyeccionVenta.to2SdFePick = to2SdFePick;
		proyeccionVenta.to4SdNoFePick = to4SdNoFePick;
		proyeccionVenta.to4SdFePick = to4SdFePick;
		proyeccionVenta.to4ShNoFePick = to4ShNoFePick;
		proyeccionVenta.to4ShFePick = to4ShFePick;

		proyeccionVenta.to2SdBook = to2SdNoFe + to2SdFe;
		proyeccionVenta.to4SdBook = to4SdNoFe + to4SdFe;
		proyeccionVenta.to4ShBook = to4ShNoFe + to4ShFe;

		proyeccionVenta.to2SdPick = to2SdNoFePick + to2SdFePick;
		proyeccionVenta.to4SdPick = to4SdNoFePick + to4SdFePick;
		proyeccionVenta.to4ShPick = to4ShNoFePick + to4ShFePick;

		return proyeccionVenta;
	}
}
