import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-proyeccion-venta-detalle',
  templateUrl: './proyeccion-venta-detalle.component.html',
  styleUrls: ['./proyeccion-venta-detalle.component.css']
})
export class ProyeccionVentaDetalleComponent {

  @Input() proyeccion: any;

  constructor() { }

}
