import { Component, Output, EventEmitter } from '@angular/core';
import { ParamsService } from 'src/app/servicios/params.service';
import { ProyeccionService } from '../../servicios/proyeccion-venta.service';
import { ProyeccionVentaCab } from '../../modelos/proyeccion-venta-cab.model';

/**
 * Controla que se muestre la proyección de ventas activa.
 * - Autor: David Anticona <danticona@wollcorp.com>
 * @version 1.0
 * @param paramService Son los parámetros del sistema.
 * @param proyeccionService Es el servicio para la proyección.
 */
@Component({
  selector: 'app-proyeccion-venta-activa',
  templateUrl: './proyeccion-venta-activa.component.html',
  styleUrls: ['./proyeccion-venta-activa.component.css']
})
export class ProyeccionVentaActivaComponent {

  /**
   * Variable que almacena las rutas para la conexión con el backend.
   */
  private urls: any;

  /**
   * Variable que almacena el token otorgado del backend.
   */
  private token: string;

  /**
   * Variable que almacena la proyeccion de ventas activa
   * obtenida de la base de datos.
   */
  protected proyeccion: ProyeccionVentaCab;

  /**
   * Variable que envía la proyección al componente padre
   */
  @Output() protected enviaProyeccion = new EventEmitter();
  
  /**
   * Variable que controla si el programa se encuentra bajando datos del servidor
   */
  public cargando = true;

  constructor(private paramService: ParamsService,
              private proyeccionService: ProyeccionService) { 

    this.urls = this.paramService.urls;
    this.token = this.paramService.conexion.token;

    this.obtieneProyeccionVentaActiva();

  }


  /**
   * Obtiene la proyección de ventas activa.
   * El resultado lo almacena en la variable "proyeccion"
   */
  private obtieneProyeccionVentaActiva() {

    this.proyeccionService.getProyecciones(this.token, this.urls)
      .subscribe((res1: any) => {
  
        if(res1.body.listaProyeccionesVenta.filter(p1 => p1.fgActi === 'A').length > 0) {
  
          let coProyAct = res1.body.listaProyeccionesVenta.filter(p1 => p1.fgActi === 'A')[0].coProyeccion;
  
          this.proyeccionService.getProyeccion(this.token, this.urls, coProyAct)
            .subscribe((res2: any) => {

              // this.proyeccion
  
              this.proyeccion = res2.body.proyeccionVenta;

              this.cargando = false;

              this.enviaProyeccion.emit(this.proyeccion);
              
            });
        } else {
          this.cargando = false;
          // console.log(this.proyeccion);
          this.enviaProyeccion.emit(this.proyeccion);
        }
      });
  }
  
}
