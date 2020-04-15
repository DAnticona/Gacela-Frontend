import { Component, Output, EventEmitter } from '@angular/core';
import { FileMTC1R999Cab } from '../../modelos/file-mtc1r999-cab.model';
import { FileMTC1R999Det } from '../../modelos/file-mtc1r999-det.model';
import { ParamsService } from 'src/app/servicios/params.service';
import { FileMTC1R999Service } from '../../servicios/file-mtc1-r999.service';
import { NavesService } from '../../servicios/naves.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogRegistrarNavesComponent } from '../opciones/maestros/naves/dialog-registrar-naves/dialog-registrar-naves.component';

/**
 * Controla el registro y obtención del file MTC1R999.
 * - Muestra el último file registrado (activo).
 * - Guarda en BD un nuevo file del tipo MTC1R999.
 * - Autor: David Anticona <danticona@wollcorp.com>
 * @version 1.0
 */
@Component({
  selector: 'app-file-mtc1r999',
  templateUrl: './file-mtc1r999.component.html',
  styleUrls: ['./file-mtc1r999.component.css'],
})
export class FileMtc1r999Component {
  /**
   * Variable que almacena las rutas para la conexión con el backend.
   */
  private urls: any;

  /**
   * Variable que almacena el token otorgado del backend.
   */
  private token: string;

  /**
   * Variable que almacena de fecha actual sin las horas.
   */
  private today = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );

  /**
   * Variable que almacena los datos del file MTC1R999,
   * tanto la cabecera como su detalle.
   */
  protected fileMtc1r999: FileMTC1R999Cab;

  /**
   * Variable que controla si se esta cargando información de la BD.
   */
  public cargando = false;

  /**
   * Variable que controla si se muestran las naves no registradas
   */
  protected mostrarDetalle = false;

  /**
   * Variable que almacena la lista de naves
   * encontradas en el file pero que no estan
   * registradas en la BD.
   */
  protected navesNoRegistradas: any[] = [];

  /**
   * Variable de salida, envía el file Mtc1r999 al componente padre
   */
  @Output() protected enviaFile = new EventEmitter();

  /**
   * Variable de salida, envía el estado al componente padre.
   */
  @Output() protected enviaCargando = new EventEmitter();

  constructor(
    private paramsService: ParamsService,
    private fileService: FileMTC1R999Service,
    private navesService: NavesService,
    public dialog: MatDialog
  ) {
    this.token = this.paramsService.conexion.token;
    this.urls = this.paramsService.urls;

    this.obtieneFileActivo();
  }

  /**
   * Método que obtiene el último file activo (último registrado).
   * Almacena el resultado en la variable fileMtc1r999
   */
  private obtieneFileActivo() {

    this.cargando = true;
    this.enviaCargando.emit(this.cargando);

    // this.fileService
    //   .listarFiles(this.token, this.urls)
    //   .subscribe((res1: any) => {
    //     let files = res1.body.filesCab;

    //     if (files.filter((f) => f.fgActi === 'A').length > 0) {
    //       let coFileAct = files.filter((f) => f.fgActi === 'A')[0].coFile;

    //       this.fileService
    //         .getFile(this.token, this.urls, coFileAct)
    //         .subscribe((res2: any) => {
    //           this.fileMtc1r999 = res2.body.fileCab;

    //           this.obtieneNavesNoRegistradas(this.fileMtc1r999.detalle);
    //         });
    //     } else {
    //       this.cargando = false;
    //       this.enviaFile.emit(this.fileMtc1r999);
    //       this.enviaCargando.emit(this.cargando);
    //     }
    //   });

    this.fileService.getFileActivo(this.token, this.urls)
      .subscribe((res: any) => {

        this.fileMtc1r999 = res.body.fileCab;

        if (this.fileMtc1r999) {

          this.obtieneNavesNoRegistradas(this.fileMtc1r999.detalle);

        } else {

          this.fileMtc1r999 = null;
          this.cargando = false;
          this.enviaFile.emit(this.fileMtc1r999);
          this.enviaCargando.emit(this.cargando);

        }

      });
  }

  /**
   * Lee el archivo txt cargado. Debe cumplir:
   * - Debe tener extensión txt.
   * - Debe ser del tipo MTC1R999, extraído del SOL
   * @param txt Archivo txt cargado a Gacela.
   * @returns El detalle del archivo cargado.
   */
  private leerTxt(txt: any) {
    let detalles: FileMTC1R999Det[] = [];

    let lines = txt.toString().split('\n');

    // REMUEVE LAS LINEAS sin valor (primeras y ultimas)
    lines = lines.slice(10, lines.length - 2);

    let idItem = 0;

    lines.forEach((line) => {
      let det = new FileMTC1R999Det();
      let posActual = 0;

      let t_depot = 6;
      let t_vsl_voy_s = 18;
      let t_booking_no = 16;
      let t_rvs = 3;
      let t_qty = 3;
      let t_pick = 4;
      let t_balance = 7;
      let t_mode = 4;
      let t_mta = 3;
      let t_tpe = 3;
      let t_rct = 5;
      let t_pol = 5;
      let t_pod = 5;
      let t_dly = 5;
      let t_release = 8;
      let t_cut_off = 8;
      let t_dry_use = 7;
      let t_pre_cool = 8;
      let t_temp = 8;
      let t_vent = 4;
      let t_commodity = 40;
      let t_special_handling = 40;
      let t_customer_ac = 12;
      let t_customer_name = 40;
      let t_remark = 20;

      idItem = idItem + 1;

      det.idItem = idItem;
      det.depot = line.substr(posActual, t_depot).trim();
      posActual = posActual + t_depot + 1;
      det.vsl_voy_s = line.substr(posActual, t_vsl_voy_s).trim();
      posActual = posActual + t_vsl_voy_s + 1;
      det.booking_no = line.substr(posActual, t_booking_no).trim();
      posActual = posActual + t_booking_no + 1;
      det.rvs = line.substr(posActual, t_rvs).trim();
      posActual = posActual + t_rvs + 1;
      det.qty = Number(line.substr(posActual, t_qty).trim());
      posActual = posActual + t_qty + 1;
      det.pick = Number(line.substr(posActual, t_pick).trim());
      posActual = posActual + t_pick + 1;
      det.balance = Number(line.substr(posActual, t_balance).trim());
      posActual = posActual + t_balance + 1;
      det.mode = line.substr(posActual, t_mode).trim();
      posActual = posActual + t_mode + 1;
      det.mta = line.substr(posActual, t_mta).trim();
      posActual = posActual + t_mta + 1;
      det.tpe = line.substr(posActual, t_tpe).trim();
      posActual = posActual + t_tpe + 1;
      det.rct = line.substr(posActual, t_rct).trim();
      posActual = posActual + t_rct + 1;
      det.pol = line.substr(posActual, t_pol).trim();
      posActual = posActual + t_pol + 1;
      det.pod = line.substr(posActual, t_pod).trim();
      posActual = posActual + t_pod + 1;
      det.dly = line.substr(posActual, t_dly).trim();
      posActual = posActual + t_dly + 1;

      let release_aux = line.substr(posActual, t_release).trim();
      det.release = new Date(
        Number(release_aux.substr(0, 4)),
        Number(release_aux.substr(4, 2)) - 1,
        Number(release_aux.substr(6, 2))
      );
      posActual = posActual + t_release + 1;

      let cut_off_aux = line.substr(posActual, t_cut_off).trim();
      det.cut_off = new Date(
        Number(cut_off_aux.substr(0, 4)),
        Number(cut_off_aux.substr(4, 2)) - 1,
        Number(cut_off_aux.substr(6, 2))
      );
      posActual = posActual + t_cut_off + 1;

      det.dry_use = line.substr(posActual, t_dry_use).trim();
      posActual = posActual + t_dry_use + 1;
      det.pre_cool = line.substr(posActual, t_pre_cool).trim();
      posActual = posActual + t_pre_cool + 1;
      det.temp = line.substr(posActual, t_temp).trim();
      posActual = posActual + t_temp + 1;
      det.vent = Number(line.substr(posActual, t_vent).trim());
      posActual = posActual + t_vent + 1;
      det.commodity = line.substr(posActual, t_commodity).trim();
      posActual = posActual + t_commodity + 1;
      det.special_handling = line.substr(posActual, t_special_handling).trim();
      posActual = posActual + t_special_handling + 1;
      det.customer_ac = line.substr(posActual, t_customer_ac).trim();
      posActual = posActual + t_customer_ac + 1;
      det.customer_name = line.substr(posActual, t_customer_name).trim();
      posActual = posActual + t_customer_name + 1;
      det.remark = line.substr(posActual, t_remark).trim();
      posActual = posActual + t_remark + 1;

      det.nave = det.vsl_voy_s.split('/')[0].trim();
      det.viaje = det.vsl_voy_s.split('/')[1].trim();

      if (det.nave.trim().length > 0) {
        detalles.push(det);
      }
    });

    return detalles;
  }

  /**
   * Obtiene el listado de naves que existen en el file pero no en la BD.
   * El resultado lo almacena en la variable "navesNoRegistradas"
   * @param detalle Obtenido del archivo leido.
   */
  private obtieneNavesNoRegistradas(detalle: Array<FileMTC1R999Det>) {
    let naves: any[] = [];

    let navesNoRegistradas: any[] = [];

    this.navesService
      .obtieneNaves(this.token, this.urls)
      .subscribe((res: any) => {
        naves = res.body.naves;

        for (let d of detalle) {
          if (naves.filter((n) => d.nave === n.alNave).length === 0) {
            navesNoRegistradas.push(d.nave);
          }
        }

        // ELIMINA DUPLICADOS
        navesNoRegistradas = navesNoRegistradas.filter(
          (valor, indiceActual, arreglo) =>
            arreglo.indexOf(valor) === indiceActual
        );

        this.navesNoRegistradas = navesNoRegistradas;

        this.cargando = false;
        this.enviaFile.emit(this.fileMtc1r999);
        this.enviaCargando.emit(this.cargando);
      });
  }

  /**
   * Método lanzado al hacer click en el boton "cargar archivo"
   * - Lee el archivo txt MTC1R999.
   * - Guarda el archivo en base de datos.
   * - Lanza el método "obtieneFileActivo" para traer los datos del archivo guardado
   */
  protected cargarFile(fileList: FileList) {
    this.cargando = true;
    this.enviaCargando.emit(this.cargando);

    let f = fileList[0];

    if (f) {
      this.fileMtc1r999 = new FileMTC1R999Cab();

      this.fileMtc1r999.noFile = f.name;
      this.fileMtc1r999.feCargaFile = new Date(this.today);
      this.fileMtc1r999.fgActi = 'A';

      let fileReader = new FileReader();

      fileReader.onload = (e) => {
        this.fileMtc1r999.detalle = this.leerTxt(fileReader.result);

        this.fileService
          .registrarFile(this.token, this.urls, this.fileMtc1r999)
          .subscribe(
            (res: any) => {
              this.obtieneFileActivo();
            },

            (err: any) => {
              this.cargando = false;
              this.navesNoRegistradas = [];
              this.fileMtc1r999 = null;
              this.enviaCargando.emit(this.cargando);
            }
          );
      };

      fileReader.readAsText(f);
    }
  }

  /**
   * Método lanzado al dar click al boton "agregar"
   * referente a las naves no registradas en BD
   * y actualiza el listado de naves y la lista de naves no registradas en BD.
   * @param index Es el índice del listado de la snaves no registradas en BD
   */
  registraNave(index: number) {
    let naves: any[] = [];

    const dialogRef = this.dialog.open(DialogRegistrarNavesComponent, {
      width: '1000px',
      height: '800px',
      data: {
        alNave: this.navesNoRegistradas[index],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.navesService
        .obtieneNaves(this.token, this.urls)
        .subscribe((res: any) => {
          naves = res.body.naves;
          this.obtieneNavesNoRegistradas(this.fileMtc1r999.detalle);
        });
    });
  }
}
