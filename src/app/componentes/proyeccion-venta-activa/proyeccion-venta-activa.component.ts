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
   * Variable que envía el estado del componente al padre.
   */
  @Output() protected enviaCargando = new EventEmitter();
  
  /**
   * Variable que controla el checkbox(switch) para activar o no la proyección de ventas
   * en el resultado.
   */
  public ventaActiva = false;

  /**
   * Variable que controla si el programa se encuentra bajando datos del servidor
   */
  public cargando = false;

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

    this.cargando = true;

    this.enviaCargando.emit(this.cargando);

    this.proyeccionService.getProyecciones(this.token, this.urls)
      .subscribe((res1: any) => {
  
        if(res1.body.listaProyeccionesVenta.filter(p1 => p1.fgActi === 'A').length > 0) {
  
          let coProyAct = res1.body.listaProyeccionesVenta.filter(p1 => p1.fgActi === 'A')[0].coProyeccion;
  
          this.proyeccionService.getProyeccion(this.token, this.urls, coProyAct)
            .subscribe((res2: any) => {
  
              this.proyeccion = res2.body.proyeccionVenta;

              this.cargando = false;

              if(this.proyeccion) {
                this.ventaActiva = true;
              } else {
                this.ventaActiva = false;
              }

              this.enviaProyeccion.emit(this.proyeccion);
              this.enviaCargando.emit(this.cargando);
              
            });
            
        } else {

          this.cargando = false;
          this.enviaProyeccion.emit(this.proyeccion);

        }
      });
  }

  /**
   * Método lanzado al activar o desactivar el checkbox ventaActiva
   * Si la venta esta activa, entonces recupera dicha proyección de ventas y la emite al componente padre
   * Si la venta esta inactiva, entonces iguala la variable a null y la emite al padre.
   */
  public setVentaActiva() {

    if(this.ventaActiva) {

      this.obtieneProyeccionVentaActiva();

    } else {

      this.proyeccion = null;
      this.enviaProyeccion.emit(this.proyeccion);
      this.enviaCargando.emit(this.cargando);

    }
    
  }
  
}
