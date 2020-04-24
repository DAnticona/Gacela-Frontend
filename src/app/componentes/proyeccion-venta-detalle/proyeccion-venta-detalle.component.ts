import { Component, Input, OnChanges } from '@angular/core';
import { ProyeccionEquiposStocks } from '../../modelos/proyeccion-equipos-stocks.model';
import { ProyeccionEquipoDet } from '../../modelos/proyeccion-equipo-det.model';

@Component({
	selector: 'app-proyeccion-venta-detalle',
	templateUrl: './proyeccion-venta-detalle.component.html',
	styleUrls: ['./proyeccion-venta-detalle.component.css'],
})
export class ProyeccionVentaDetalleComponent implements OnChanges {
	/**
	 * Variable que trae la proyección desde el componente padre
	 */
	@Input() proyeccion: any;

	@Input() public stock: ProyeccionEquiposStocks;

	detalle: ProyeccionEquipoDet[];
	rpoPlan: ProyeccionEquipoDet[];

	constructor() {}

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
		this.detalle = this.proyeccion.detalles.filter(d => d.fgRpoPlan === 'N');
		this.rpoPlan = this.proyeccion.detalles.filter(r => r.fgRpoPlan === 'S');

		this.actualizaTotales();
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
}
