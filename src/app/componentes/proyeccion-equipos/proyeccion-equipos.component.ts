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
import { RpoPlanService } from '../../servicios/rpo-plan.service';
import { RpoPlan } from '../../models/rpoPlan.model';

@Component({
  selector: 'app-proyeccion-equipos',
  templateUrl: './proyeccion-equipos.component.html',
  styleUrls: ['./proyeccion-equipos.component.css'],
  providers: [DatePipe]
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
   * Variable que almacena los datos de la proyección generada por el equipo de ventas
   */
  public proyeccionVenta = new ProyeccionVentaCab();

  /**
   * Variable que almacena la proyección de equipos generada.
   */
  protected proyeccionEquipo = new ProyeccionEquipoCab();

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
  protected today = new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate());

  /**
   * Variable que controla si se hizo click en el boton proyeccionGenerada.
   */
  public proyeccionGenerada = false;

  // public tieneFechaLimite: boolean;

  // public fechaLimite: string;

  public cargando = false;

  public cargandoProyVenta = true;
  public cargandoFile = true;
  public cargandoRatio = true;

  constructor(private paramService: ParamsService,
              private proyeccionService: ProyeccionService,
              private calendarioService: CalendarioService,
              private rpoPlanService: RpoPlanService,
              private datepipe: DatePipe) {

    this.urls = this.paramService.urls;
    this.token = this.paramService.conexion.token;

  }

  /**
   * Método que se emite desde el componente ProyeccionVentaActiva,
   * Trae la proyección de ventas desde la BD
   * @param event Es el valor retornado desde el componente (proyección de ventas)
   */
  public traeProyeccionVenta(event) {

    if(event) {

      this.proyeccionVenta = event;

    } else {

      this.proyeccionVenta = null;
      
    }

    this.cargandoProyVenta = false;

  }

  /**
   * Método que se emite desde el componente RatioDevolucion,
   * trae los ratios de devolución desde la BD.
   * @param event Es el valor de retorno del componente (Ratio de devolución)
   */
  public traeRatioDevolucion(event) {

    if(event) {

      this.ratioDevolucion = event;

    } else {

      this.ratioDevolucion = null;

    }

    
    this.cargandoRatio = false;

  }

  /**
   * Método que se emite desde el componente FileMtc1r999,
   * trae el último archivo MTC1R999.
   * @param event Es el valor de retorno del componente (File MTC1R999)
   */
  public traeFileMtc1r999(event) {

    if(event) {

      this.fileMtc1r999 = event;

    } else {

      this.fileMtc1r999 = null;

    }

    this.cargandoFile = false;

  }

  /**
   * Método lanzado al hacer click en el boton "Generar Proyeccion".
   * Muestra la proyección de ventas y esquipos
   */
  public generaProyeccionEquipos() {

    this.cargando = true;

    this.proyeccionGenerada = false;

    this.proyeccionEquipo = new ProyeccionEquipoCab();

    // this.proyeccionEquipo

    this.proyeccionService.generaResumenProyeccion(this.token, this.urls, this.fileMtc1r999.coFile)
      .subscribe((res: any) => {

        // console.log(res);

        this.resumen = res.body.proyeccionGenerada;

        // if(this.fechaLimite) {

        //   let fechaLimite = new Date(Number(this.fechaLimite.substr(0,4)), Number(this.fechaLimite.substr(5,2)) - 1, Number(this.fechaLimite.substr(8,2)));

        //   this.resumen = this.resumen.filter(r => r.eta.getTime() <= fechaLimite.getTime());

        // }

        this.iniciaDatosCabecera();

        this.resumenToDetalle(this.resumen);

        this.proyeccionEquipo.ratio2Sd = this.ratioDevolucion.ratio2Sd;
        this.proyeccionEquipo.ratio4Sd = this.ratioDevolucion.ratio4Sd;
        this.proyeccionEquipo.ratio4Sh = this.ratioDevolucion.ratio4Sh;
    
        this.proyeccionEquipo.nroDiasHabiles = 24;
    
        let lastEta = new Date(this.proyeccionEquipo.detalles[this.proyeccionEquipo.detalles.length-1].eta.getTime());
        this.proyeccionEquipo.feEmptyReturn = new Date(lastEta.getFullYear(), lastEta.getMonth(), lastEta.getDate() - 7);
    
        let fechaIni = new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate());
        let fechaFin = new Date(this.proyeccionEquipo.detalles[this.proyeccionEquipo.detalles.length-1].eta.getTime());
    
        
        this.calendarioService.getCalendario(this.token, this.urls, this.datepipe.transform(fechaIni, 'yyyy-MM-dd'), this.datepipe.transform(fechaFin, 'yyyy-MM-dd'))
          .subscribe(res2 => {
    
            let calendario = res2.body.calendario;
      
            this.proyeccionEquipo.nroDiasAlRetorno = calendario.filter(c => c.fecha.getTime() > this.today.getTime() && c.fecha.getTime() <= lastEta && c.fgFeriado === 'N').length;
            
            this.proyeccionEquipo.ca2SdEmptyRet = Math.round((this.ratioDevolucion.ratio2Sd/this.proyeccionEquipo.nroDiasHabiles)*this.proyeccionEquipo.nroDiasAlRetorno);
            this.proyeccionEquipo.ca4SdEmptyRet = Math.round((this.ratioDevolucion.ratio4Sd/this.proyeccionEquipo.nroDiasHabiles)*this.proyeccionEquipo.nroDiasAlRetorno);
            this.proyeccionEquipo.ca4ShEmptyRet = Math.round((this.ratioDevolucion.ratio4Sh/this.proyeccionEquipo.nroDiasHabiles)*this.proyeccionEquipo.nroDiasAlRetorno);

            this.proyeccionEquipo.available2Sd += this.proyeccionEquipo.ca2SdEmptyRet;
            this.proyeccionEquipo.available4Sd += this.proyeccionEquipo.ca4SdEmptyRet;
            this.proyeccionEquipo.available4Sh += this.proyeccionEquipo.ca4ShEmptyRet;


            // TRAE LOS RPO PLAN
            this.rpoPlanService.obtieneRpoPlan(this.urls, this.token)
              .subscribe((res3: any) => {

                // console.log(res3);

                let rpoPlan = res3.body.planes.planes;

                // console.log(rpoPlan);

                for(let p of rpoPlan) {
                  
                  let detalle = new ProyeccionEquipoDet();

                  detalle.idItem = this.proyeccionEquipo.detalles.length + 1;
                  detalle.alNave = p.alNaveRpo;
                  detalle.viaje = p.viajeRpo;
                  detalle.eta = p.etaRpo;
                  detalle.fgRpoPlan = 'S';
                  detalle.caRpo2Sd = p.ca2SdRpo;
                  detalle.caRpo4Sd = p.ca4SdRpo;
                  detalle.caRpo4Sh = p.ca4ShRpo;

                  this.proyeccionEquipo.available2Sd += detalle.caRpo2Sd;
                  this.proyeccionEquipo.available4Sd += detalle.caRpo4Sd;
                  this.proyeccionEquipo.available4Sh += detalle.caRpo4Sh;

                  this.proyeccionEquipo.detalles.push(detalle);

                }
                
                this.proyeccionGenerada = true;

                this.cargando = false;

              });

          });

      });

  }

  /**
   * Método que obtiene los datos de la cabecera de la proyección
   */
  private iniciaDatosCabecera() {

    this.proyeccionEquipo = new ProyeccionEquipoCab();

    this.proyeccionEquipo.coTiProy = 'DR';
    this.proyeccionEquipo.coProyEqui = null;
    this.proyeccionEquipo.coFile = this.fileMtc1r999.coFile;
    this.proyeccionEquipo.coProyVenta = this.proyeccionVenta.coProyeccion;
    this.proyeccionEquipo.feCrea = this.today;
    this.proyeccionEquipo.nroSem = 0;

    this.proyeccionEquipo.stock2Sd = 0;
    this.proyeccionEquipo.stock4Sd = 0;
    this.proyeccionEquipo.stock4Sh = 0;

    this.proyeccionEquipo.available2Sd = 0;
    this.proyeccionEquipo.available4Sd = 0;
    this.proyeccionEquipo.available4Sh = 0;
    
  }

  /**
   * Genera la proyección de equipos a partir del resumen obtenido desde la BD.
   * - Obtiene el detalle de la proyección ordenado por ETA
   * - Calcula totales iniciales de la proyección de equipos
   * @param resumen Resumen obtenido desde la BD
   * @returns Proyección generada a partir del resumen.
   */
  private resumenToDetalle(resumen: any[]) {

    this.proyeccionEquipo.detalles = new Array<ProyeccionEquipoDet>();

    // console.log(this.resumen);

    resumen.forEach(p => {
      // console.log(this.proyeccionEquipo.detalles.filter(d => d.alNave === p.alNave && d.viaje === p.viaje && d.eta.getTime() === p.eta.getTime()));
    
      if(this.proyeccionEquipo.detalles.filter(d => d.alNave === p.alNave && d.viaje === p.viaje && d.eta.getTime() === p.eta.getTime()).length === 0) {

        // console.log(p);
        let det = new ProyeccionEquipoDet();

        det.idItem = this.proyeccionEquipo.detalles.length + 1;
        det.alNave = p.alNave;
        det.viaje = p.viaje;
        det.eta = p.eta;

        // console.log(det);

        this.proyeccionEquipo.detalles.push(det);

        // console.log(this.proyeccionEquipo.detalles);

      }
    });

    for(let d of this.proyeccionEquipo.detalles) {

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

    // console.log(this.resumen.filter(f => f.alNave === 'URNS'));
    
    this.proyeccionEquipo.detalles.forEach(d => {

      // console.log(d);
    
      resumen.filter(f => f.alNave === d.alNave && f.viaje === d.viaje && f.eta.getTime() === d.eta.getTime()).forEach(p => {

        // console.log(p);

        if(p.tpe === '2SD' && p.fgFarEast === 'S') {

          d.ca2SdFe = p.qty;
          d.ca2SdFePick = p.pick;

        } else if(p.tpe === '2SD' && p.fgFarEast === 'N') {

          d.ca2SdNoFe = p.qty;
          d.ca2SdNoFePick = p.pick;
        
        } else if(p.tpe === '4SD' && p.fgFarEast === 'S') {

          d.ca4SdFe = p.qty;
          d.ca4SdFePick = p.pick;


        } else if(p.tpe === '4SD' && p.fgFarEast === 'N') {

          d.ca4SdNoFe = p.qty;
          d.ca4SdNoFePick = p.pick;
        
        } else if(p.tpe === '4SH' && p.fgFarEast === 'S') {

          d.ca4ShFe = p.qty;
          d.ca4ShFePick = p.pick;

        } else if(p.tpe === '4SH' && p.fgFarEast === 'N') {

          d.ca4ShNoFe = p.qty;
          d.ca4ShNoFePick = p.pick;
        
        }

      });

    });

    // console.log(this.proyeccionEquipo.detalles);
    
    this.proyeccionEquipo.detalles.sort((a, b) => new Date(a.eta).getTime() - new Date(b.eta).getTime());

    this.proyeccionEquipo.to2SdFe = 0;
    this.proyeccionEquipo.to2SdNoFe = 0;
    this.proyeccionEquipo.to4SdNoFe = 0;
    this.proyeccionEquipo.to4SdFe = 0;
    this.proyeccionEquipo.to4ShNoFe = 0;
    this.proyeccionEquipo.to4ShFe = 0;
    this.proyeccionEquipo.to2SdNoFePick = 0;
    this.proyeccionEquipo.to2SdFePick = 0;
    this.proyeccionEquipo.to4SdNoFePick = 0;
    this.proyeccionEquipo.to4SdFePick = 0;
    this.proyeccionEquipo.to4ShNoFePick = 0;
    this.proyeccionEquipo.to4ShFePick = 0;

    for(let d of this.proyeccionEquipo.detalles) {
        
      this.proyeccionEquipo.to2SdFe += d.ca2SdFe;
      this.proyeccionEquipo.to2SdNoFe += d.ca2SdNoFe;
      this.proyeccionEquipo.to4SdFe += d.ca4SdFe;
      this.proyeccionEquipo.to4SdNoFe += d.ca4SdNoFe;
      this.proyeccionEquipo.to4ShFe += d.ca4ShFe;
      this.proyeccionEquipo.to4ShNoFe += d.ca4ShNoFe;
      this.proyeccionEquipo.to2SdFePick += d.ca2SdFePick;
      this.proyeccionEquipo.to2SdNoFePick += d.ca2SdNoFePick;
      this.proyeccionEquipo.to4SdFePick += d.ca4SdFePick;
      this.proyeccionEquipo.to4SdNoFePick += d.ca4SdNoFePick;
      this.proyeccionEquipo.to4ShFePick += d.ca4ShFePick;
      this.proyeccionEquipo.to4ShNoFePick += d.ca4ShNoFePick;
        
    }
        
    this.proyeccionEquipo.to2SdBook = this.proyeccionEquipo.to2SdFe + this.proyeccionEquipo.to2SdNoFe;
    this.proyeccionEquipo.to4SdBook = this.proyeccionEquipo.to4SdFe + this.proyeccionEquipo.to4SdNoFe;
    this.proyeccionEquipo.to4ShBook = this.proyeccionEquipo.to4ShFe + this.proyeccionEquipo.to4ShNoFe;

    this.proyeccionEquipo.to2SdPick = this.proyeccionEquipo.to2SdFePick + this.proyeccionEquipo.to2SdNoFePick;
    this.proyeccionEquipo.to4SdPick = this.proyeccionEquipo.to4SdFePick + this.proyeccionEquipo.to4SdNoFePick;
    this.proyeccionEquipo.to4ShPick = this.proyeccionEquipo.to4ShFePick + this.proyeccionEquipo.to4ShNoFePick;

    this.proyeccionEquipo.available2Sd = this.proyeccionEquipo.stock2Sd - this.proyeccionEquipo.to2SdBook + this.proyeccionEquipo.to2SdPick;
    this.proyeccionEquipo.available4Sd = this.proyeccionEquipo.stock4Sd - this.proyeccionEquipo.to4SdBook + this.proyeccionEquipo.to4SdPick;
    this.proyeccionEquipo.available4Sh = this.proyeccionEquipo.stock4Sh - this.proyeccionEquipo.to4ShBook + this.proyeccionEquipo.to4ShPick;

  }

}