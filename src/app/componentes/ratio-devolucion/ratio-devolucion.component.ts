import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ParamsService } from '../../servicios/params.service';
import { RatioDevolucionService } from '../../servicios/ratio-devolucion.service';
import { RatioDevolucion } from 'src/app/modelos/ratio-devolucion.model';
/**
 * Controlador para los ratios de devolucion,
 * registra y consulta los ratios de devolución mensual.
 * - Autor: David Anticona <danticona@wollcorp.com>
 * - Creado: 06/03/2020
 * - Modificado:
 * @version 1.0
 * @param paramsService Parámetros del sistema.
 * @param ratioDevolucionService Servicio de los ratios de devolución.
 */
@Component({
  selector: 'app-ratio-devolucion',
  templateUrl: './ratio-devolucion.component.html',
  styleUrls: ['./ratio-devolucion.component.css']
})
export class RatioDevolucionComponent {

  //#region VARIABLES

  /**
   * Variable que almacena las rutas para la conexión con el backend
   */
  private urls: any;

  /**
   * Variable que almacena el token otorgado del backend
   */
  private token: string;

  /**
   * Variable que almacena el valor de la fecha de hoy.
   */
  private today = new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate());

  /**
   * Variable del formulario,
   * contiene todos los datos mostrados en la pantalla.
   */
  public forma: FormGroup;

  /**
   * Modelo del ratio de devolución.
   */
  protected ratioDevolucion = new RatioDevolucion();

  /**
   * Variable que controla si los campos de ratio de devolución
   * son editables o no, las condiciones para ser editable son:
   * - Todos los lunes sin excepción.
   * - Resto de días pero que en el último lunes no lo hayan actualizado.
   */
  public ratioEditable: boolean;

  /**
   * Indica si el componente está cargando.
   */
  public cargando = true;

  /**
   * Variable que envía el ratio de devolución al componente padre
   */
  @Output() protected enviaRatio = new EventEmitter();



  //#endregion VARIABLES

  constructor(private paramsService: ParamsService,
              private ratioDevolucionService: RatioDevolucionService) {

    this.urls = this.paramsService.urls;
    this.token = paramsService.conexion.token;

    this.forma = new FormGroup({

      'ratio2Sd': new FormControl(0),
      'ratio4Sd': new FormControl(0),
      'ratio4Sh': new FormControl(0),
      'usCrea': new FormControl(''),
      'usModi': new FormControl(''),
      'feCrea': new FormControl(new Date()),
      'feModi': new FormControl(new Date())

    });

    this.obtieneRatioDevolucion();

  }

  /**
   * Método que obtiene los ratios de devolución
   * y lo almacena en la variable "ratioDevolucion"
   */
  private obtieneRatioDevolucion() {

    this.ratioDevolucionService.obtieneRatio(this.token, this.urls)
      .subscribe((res: any) => {

        this.ratioDevolucion = res.body.ratio;
        this.forma.setValue(this.ratioDevolucion);
        this.ratioEditable = this.esEditable();
        this.cargando = false;
        this.enviaRatio.emit(this.ratioDevolucion);

      });

  }

  /**
   * Devuelve true o false dependiendo si los campos de
   * ratio de devolución son editables o no. Devuelve true si:
   * - Todos los lunes
   * - Resto de días pero que en el último lunes no lo hayan actualizado.
   * @returns true si los campos son editables, false si los campos no son editables.
   */
  private esEditable(): boolean {

    let editable = false;
    let todayAux = new Date(this.today.getTime());
    let ultimoLunes = new Date(todayAux.setDate(todayAux.getDate() - (todayAux.getDay() - 1)));

    if(this.ratioDevolucion.feModi) {

      if(this.today.getDay() === 1) {

        editable = true;
  
      } else if((ultimoLunes.getTime() - this.ratioDevolucion.feModi.getTime())/1000/60/60/24 > 0) {
  
        editable = true;
  
      } else {
  
        editable = false;
  
      }

    } else {

      editable = true;
      
    }



    return editable;

  }

  /**
   * Método lanzado al dar click en el boton guardar ratio
   * - Registra los valores del ratio de devolución en la BD.
   */
  protected guardarRatio() {

    this.cargando = true;

    this.ratioDevolucion = this.forma.getRawValue();

    this.ratioDevolucionService.registraRatio(this.token, this.urls, this.ratioDevolucion)
      .subscribe(res => {

        this.obtieneRatioDevolucion();
        this.ratioEditable = this.esEditable();
        this.cargando = false;

      });

  }

}
