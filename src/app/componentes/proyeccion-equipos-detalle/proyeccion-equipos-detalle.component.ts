import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ProyeccionEquipoCab } from '../../modelos/proyeccion-equipo-cab.model';
import { ProyeccionEquipoDet } from 'src/app/modelos/proyeccion-equipo-det.model';
import { MatDialog } from '@angular/material/dialog';
import { ParamsService } from '../../servicios/params.service';
import Swal from 'sweetalert2';
import { ProyeccionEquiposStocks } from '../../modelos/proyeccion-equipos-stocks.model';
import { ProyeccionService } from 'src/app/servicios/proyeccion-venta.service';
import { FileService } from '../../servicios/file.service';

@Component({
	selector: 'app-proyeccion-equipos-detalle',
	templateUrl: './proyeccion-equipos-detalle.component.html',
	styleUrls: ['./proyeccion-equipos-detalle.component.css'],
})
export class ProyeccionEquiposDetalleComponent implements OnChanges {
	private urls: any;
	private token: string;

	@Input() public proyeccion: ProyeccionEquipoCab;
	@Input() private proyeccionVenta: ProyeccionEquipoCab;
	@Input() public stock: ProyeccionEquiposStocks;
	@Output() private enviaCargando = new EventEmitter();

	detalle: ProyeccionEquipoDet[];
	rpoPlan: ProyeccionEquipoDet[];

	today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

	public cargando = false;

	constructor(
		private paramService: ParamsService,
		public dialog: MatDialog,
		private proyeccionService: ProyeccionService,
		private fileService: FileService
	) {
		this.urls = this.paramService.urls;
		this.token = this.paramService.conexion.token;
	}

	ngOnChanges(): void {
		if (this.stock) {
			if (this.stock.stock2Sd) {
				this.proyeccion.stock2Sd = this.stock.stock2Sd;
			} else {
				this.proyeccion.stock2Sd = 0;
			}
			if (this.stock.stock4Sd) {
				this.proyeccion.stock4Sd = this.stock.stock4Sd;
			} else {
				this.proyeccion.stock4Sd = 0;
			}
			if (this.stock.stock4Sh) {
				this.proyeccion.stock4Sh = this.stock.stock4Sh;
			} else {
				this.proyeccion.stock4Sh = 0;
			}
		}
		if (this.stock && this.proyeccionVenta) {
			if (this.stock.stock2Sd) {
				this.proyeccionVenta.stock2Sd = this.stock.stock2Sd;
			} else {
				this.proyeccionVenta.stock2Sd = 0;
			}
			if (this.stock.stock4Sd) {
				this.proyeccionVenta.stock4Sd = this.stock.stock4Sd;
			} else {
				this.proyeccionVenta.stock4Sd = 0;
			}
			if (this.stock.stock4Sh) {
				this.proyeccionVenta.stock4Sh = this.stock.stock4Sh;
			} else {
				this.proyeccionVenta.stock4Sh = 0;
			}
		}

		this.detalle = this.proyeccion.detalles.filter(d => d.fgRpoPlan === 'N');
		this.rpoPlan = this.proyeccion.detalles.filter(r => r.fgRpoPlan === 'S');

		this.actualizaTotales();

		if (this.proyeccionVenta) {
			this.actualizaTotalesVentas();
		}
	}

	/**
	 * Método lanzado al detectar cambios en los stocks.
	 * Actualiza los totales de la proyección de equipos.
	 */
	public actualizaTotales(): void {
		let to2SdRpo = 0;
		let to4SdRpo = 0;
		let to4ShRpo = 0;

		let to2SdAux = this.proyeccion.ca2SdEmptyRet + this.proyeccion.to2SdPick - this.proyeccion.to2SdBook;
		let to4SdAux = this.proyeccion.ca4SdEmptyRet + this.proyeccion.to4SdPick - this.proyeccion.to4SdBook;
		let to4ShAux = this.proyeccion.ca4ShEmptyRet + this.proyeccion.to4ShPick - this.proyeccion.to4ShBook;

		this.rpoPlan.forEach(rpo => {
			to2SdRpo += Number(rpo.caRpo2Sd);
			to4SdRpo += Number(rpo.caRpo4Sd);
			to4ShRpo += Number(rpo.caRpo4Sh);
		});

		this.proyeccion.available2Sd = this.proyeccion.stock2Sd + to2SdRpo + to2SdAux;
		this.proyeccion.available4Sd = this.proyeccion.stock4Sd + to4SdRpo + to4SdAux;
		this.proyeccion.available4Sh = this.proyeccion.stock4Sh + to4ShRpo + to4ShAux;
	}

	/**
	 * Método lanzado al hacer click en el boton "Exportar".
	 * Exporta la proyección a excel.
	 */
	exportar() {
		this.cargando = true;
		this.enviaCargando.emit(this.cargando);

		let proyeccionEquipoExcel = {
			proyEquipo: this.proyeccion,
			proyVenta: this.proyeccionVenta,
		};

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
						this.fileService.deleteFile(this.urls, fileName, this.token).subscribe();
						this.cargando = false;
						this.enviaCargando.emit(this.cargando);
					},
				});
			});
	}

	public actualizaTotalesVentas(): void {
		let to2SdRpo = 0;
		let to4SdRpo = 0;
		let to4ShRpo = 0;

		let to2SdAux =
			this.proyeccionVenta.ca2SdEmptyRet + this.proyeccionVenta.to2SdPick - this.proyeccionVenta.to2SdBook;
		let to4SdAux =
			this.proyeccionVenta.ca4SdEmptyRet + this.proyeccionVenta.to4SdPick - this.proyeccionVenta.to4SdBook;
		let to4ShAux =
			this.proyeccionVenta.ca4ShEmptyRet + this.proyeccionVenta.to4ShPick - this.proyeccionVenta.to4ShBook;

		this.rpoPlan.forEach(rpo => {
			to2SdRpo += Number(rpo.caRpo2Sd);
			to4SdRpo += Number(rpo.caRpo4Sd);
			to4ShRpo += Number(rpo.caRpo4Sh);
		});

		this.proyeccionVenta.available2Sd = this.proyeccionVenta.stock2Sd + to2SdRpo + to2SdAux;
		this.proyeccionVenta.available4Sd = this.proyeccionVenta.stock4Sd + to4SdRpo + to4SdAux;
		this.proyeccionVenta.available4Sh = this.proyeccionVenta.stock4Sh + to4ShRpo + to4ShAux;
	}
}
