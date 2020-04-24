import { Component, Output, EventEmitter } from '@angular/core';
import { ProyeccionEquiposStocks } from '../../modelos/proyeccion-equipos-stocks.model';

/**
 * Controlador que implementa el registro de stocks para la proyección de equipos.
 * Los stocks ingresados en este componente son emitidos al componente padre
 * cuando se da click en el boton guardar.
 * - Autor: David Anticona - <danticona@wollcorp.com>
 * - Creado el: 16/04/2020
 */
@Component({
	selector: 'app-proyeccion-equipos-stocks',
	templateUrl: './proyeccion-equipos-stocks.component.html',
	styleUrls: ['./proyeccion-equipos-stocks.component.css'],
})
export class ProyeccionEquiposStocksComponent {
	/**
	 * Variable emite los stocks al componente padre.
	 */
	@Output() private enviaStock = new EventEmitter();

	/**
	 * Variable que almacena los stocks de la proyección de equipos
	 * para enviarlo al componente padre
	 */
	private stock: ProyeccionEquiposStocks;

	/**
	 * Variable que almacena los stocks tipo 2SD
	 */
	public stock2Sd = 0;

	/**
	 * Variable que almacena los stocks tipo 4SD
	 */
	public stock4Sd = 0;

	/**
	 * Variable que almacena los stocks tipo 4SH
	 */
	public stock4Sh = 0;

	constructor() {}

	/**
	 * Método lanzado al escribir en los campos stocks.
	 * Genera una nueva instancia de stock para que el componente padre detecte el cambio.
	 * Emite el valor al componente padre.
	 */
	public editaValor() {
		this.stock = new ProyeccionEquiposStocks();
		this.stock.stock2Sd = this.stock2Sd;
		this.stock.stock4Sd = this.stock4Sd;
		this.stock.stock4Sh = this.stock4Sh;

		this.enviaStock.emit(this.stock);
	}
}
