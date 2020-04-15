import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-proyeccion-venta-detalle',
  templateUrl: './proyeccion-venta-detalle.component.html',
  styleUrls: ['./proyeccion-venta-detalle.component.css']
})
export class ProyeccionVentaDetalleComponent {

  /**
   * Variable que trae la proyección desde el componente padre
   */
  @Input() proyeccion: any;
  
  constructor() { }

}
