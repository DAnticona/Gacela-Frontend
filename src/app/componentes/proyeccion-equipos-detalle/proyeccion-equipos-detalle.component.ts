import { Component, Input, OnChanges } from '@angular/core';
import { ProyeccionEquipoCab } from '../../modelos/proyeccion-equipo-cab.model';
import { DatePipe } from '@angular/common';
import { ProyeccionEquipoDet } from 'src/app/modelos/proyeccion-equipo-det.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogListarNavesComponent } from '../opciones/maestros/naves/dialog-listar-naves/dialog-listar-naves.component';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RpoPlanService } from '../../servicios/rpo-plan.service';
import { RpoPlan } from 'src/app/modelos/rpo-plan.model';
import { ParamsService } from '../../servicios/params.service';
import { ProyeccionService } from 'src/app/servicios/proyeccion-venta.service';
import { ProyeccionVentaCab } from '../../modelos/proyeccion-venta-cab.model';
import Swal from 'sweetalert2';
import { FileService } from '../../servicios/file.service';

@Component({
  selector: 'app-proyeccion-equipos-detalle',
  templateUrl: './proyeccion-equipos-detalle.component.html',
  styleUrls: ['./proyeccion-equipos-detalle.component.css'],
  providers: [DatePipe]
})
export class ProyeccionEquiposDetalleComponent implements OnChanges {

  private urls: any;
  private token: string;

  @Input() public proyeccion: ProyeccionEquipoCab;
  @Input() private proyeccionVenta: ProyeccionVentaCab;

  public forma: FormGroup;

  detalle: ProyeccionEquipoDet[];
  rpoPlan: ProyeccionEquipoDet[];

  today = new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate());

  public cargando = false;

  constructor(private paramService: ParamsService,
              public dialog: MatDialog,
              public datepipe: DatePipe,
              private fileService: FileService,
              private proyeccionService: ProyeccionService,
              private rpoPlanService: RpoPlanService) {

    this.urls = this.paramService.urls;
    this.token = this.paramService.conexion.token;

    this.forma = new FormGroup({

      stock2Sd: new FormControl(),
      stock4Sd: new FormControl(),
      stock4Sh: new FormControl(),

      rpoPlan: new FormArray([])

    });
    
  }

  ngOnChanges(): void {
    
    // console.log(this.proyeccion.detalles);
    this.detalle = this.proyeccion.detalles.filter(d => d.fgRpoPlan === 'N');
    this.rpoPlan = this.proyeccion.detalles.filter(r => r.fgRpoPlan === 'S');

    // console.log(this.detalle);

    this.rpoPlan.forEach(r => {

      this.agregaFormaRpoPlan(r);

    });

  }
  
  /**
   * Agrega un registro tipo RPO al formulario.
   */
  agregaFormaRpoPlan(detalleRpo: ProyeccionEquipoDet) {

    (this.forma.controls['rpoPlan'] as FormArray).push(

      new FormGroup({

        coRpo: new FormControl(null),
        alNaveRpo: new FormControl({value: detalleRpo.alNave, disabled: true}, Validators.required),
        viajeRpo: new FormControl(detalleRpo.viaje, Validators.required),
        etaRpo: new FormControl(this.datepipe.transform(detalleRpo.eta, 'yyyy-MM-dd'), Validators.required),
        ca2SdRpo: new FormControl(detalleRpo.caRpo2Sd, Validators.required),
        ca4SdRpo: new FormControl(detalleRpo.caRpo4Sd, Validators.required),
        ca4ShRpo: new FormControl(detalleRpo.caRpo4Sh, Validators.required),
        fgActiRpo: new FormControl(null)

      })

    );

  }
  
  /**
   * Método lanzado al hacer click al boton "+"
   * para agregar un nuevo registro al RPO plan
   */
  addRpo() {
    
    this.getNave()
      .then(res => {

        let alNave = res;

        let detalleRpo = new ProyeccionEquipoDet();

        detalleRpo.idItem = this.rpoPlan.length;
        detalleRpo.alNave = alNave;
        detalleRpo.viaje = null;
        detalleRpo.fgRpoPlan = 'S';
        detalleRpo.caRpo2Sd = 0;
        detalleRpo.caRpo4Sd = 0;
        detalleRpo.caRpo4Sh = 0;
        detalleRpo.eta = this.today;

        this.agregaFormaRpoPlan(detalleRpo);

      })
      .catch(err => console.log(err));

  }

  /**
   * Método lanzado al dar click al boton Editar nave del RPO plan.
   * Permite modificar la nave seleccionada en un RPO plan.
   */
  editaAlNaveRpo(index: number) {

    this.getNave()
      .then(res => {
        
        let alNave = res;
  
        (this.forma.controls['rpoPlan'] as FormArray).controls[index]['controls']['alNaveRpo'].setValue(alNave);
        
      })
      .catch(err => console.error(err));

  }

  /**
   * Método lanzado al dar click en eliminar registro RPO.
   * @param index Índice del registro del RPO plan para, permite identificar el registro a eliminar.
   */
  delRpo(index: number) {

    (this.forma.controls['rpoPlan'] as FormArray).removeAt(index);
    this.actualizaTotales();

  }

  /**
   * Consulta y permite seleccionar una nave a partir del maestro de naves de la BD.
   * Llama una ventana dialog que muestra el maestro de naves.
   * @returns El código de la nave seleccionada.
   */
  private async getNave(): Promise<any> {

    const promesa = await new Promise((resolve, reject) => {

        const dialogRef = this.dialog.open(DialogListarNavesComponent, {
          width: '1000px',
          height: '800px',
        });
      
        dialogRef.afterClosed().subscribe((alNave: string) => {
                
          if(!alNave) {
    
            let error = new Error('No seleccionó ninguna nave...');
            reject(error);
    
          }

          resolve(alNave);
    
        });
      });

    return promesa;
  }

  /**
   * Método lanzado al cambiar los montos del formulario
   * Actualiza los totales de la proyección de equipos.
   * Este método debe llamarse cada vez que se ingresan nuevos valores al formulario.
   */
  actualizaTotales() {
    
    let to2SdRpo = 0;
    let to4SdRpo = 0;
    let to4ShRpo = 0;

    let to2SdAux = this.proyeccion.ca2SdEmptyRet + this.proyeccion.to2SdPick - this.proyeccion.to2SdBook;
    let to4SdAux = this.proyeccion.ca4SdEmptyRet + this.proyeccion.to4SdPick - this.proyeccion.to4SdBook;
    let to4ShAux = this.proyeccion.ca4ShEmptyRet + this.proyeccion.to4ShPick - this.proyeccion.to4ShBook;

    (this.forma.controls['rpoPlan'] as FormArray).controls.forEach(detalle => {
      
      to2SdRpo += Number(detalle['controls']['ca2SdRpo'].value);
      to4SdRpo += Number(detalle['controls']['ca4SdRpo'].value);
      to4ShRpo += Number(detalle['controls']['ca4ShRpo'].value);

    });

    this.proyeccion.stock2Sd = Number(this.forma.controls.stock2Sd.value);
    this.proyeccion.stock4Sd = Number(this.forma.controls.stock4Sd.value);
    this.proyeccion.stock4Sh = Number(this.forma.controls.stock4Sh.value);

    this.proyeccion.available2Sd = this.proyeccion.stock2Sd + to2SdRpo + to2SdAux;
    this.proyeccion.available4Sd = this.proyeccion.stock4Sd + to4SdRpo + to4SdAux;
    this.proyeccion.available4Sh = this.proyeccion.stock4Sh + to4ShRpo + to4ShAux;

  }

  /**
   * Validación de los RPO en conjunto, valida a nivel de registro (3 montos al mismo tiempo):
   * - Valida que el ETA no sea mayor que 3 días.
   * - si los montos son negativos, el ETA debe ser igual a hoy.
   * @param index Índice para identificar el registro del RPO
   * @returns 'D' si el Rpo no es válido y 'A' si el Rpo es válido.
   */
  isRpoValido(index: number): boolean {

    let valido = true;

    let fecha = this.forma.controls['rpoPlan']['controls'][index]['controls'].etaRpo.value;

    let caRpo2Sd = Number(this.forma.controls['rpoPlan']['controls'][index]['controls'].ca2SdRpo.value);
    let caRpo4Sd = Number(this.forma.controls['rpoPlan']['controls'][index]['controls'].ca4SdRpo.value);
    let caRpo4Sh = Number(this.forma.controls['rpoPlan']['controls'][index]['controls'].ca4ShRpo.value);

    let eta = new Date(fecha.substr(0,4), fecha.substr(5,2) - 1, fecha.substr(8,2));

    if((this.today.getTime() - eta.getTime())/1000/60/60/24 >= 3) {

      this.forma.controls['rpoPlan']['controls'][index]['controls'].fgActiRpo.setValue('D');

      this.forma.controls['rpoPlan']['controls'][index]['controls'].ca2SdRpo.setValue(0);
      this.forma.controls['rpoPlan']['controls'][index]['controls'].ca4SdRpo.setValue(0);
      this.forma.controls['rpoPlan']['controls'][index]['controls'].ca4ShRpo.setValue(0);

      // this.actualizaTotales();

      valido = false;

    } else if(caRpo2Sd <= 0 && caRpo4Sd <= 0 && caRpo4Sh <= 0 && (this.today.getTime() - eta.getTime())/1000/60/60/24 > 0) {

      this.forma.controls['rpoPlan']['controls'][index]['controls'].fgActiRpo.setValue('D');

      this.forma.controls['rpoPlan']['controls'][index]['controls'].ca2SdRpo.setValue(0);
      this.forma.controls['rpoPlan']['controls'][index]['controls'].ca4SdRpo.setValue(0);
      this.forma.controls['rpoPlan']['controls'][index]['controls'].ca4ShRpo.setValue(0);

      // this.actualizaTotales();
      
      valido = false;

    } else {

      this.forma.controls['rpoPlan']['controls'][index]['controls'].fgActiRpo.setValue('A');

      // this.actualizaTotales();
      valido = true;

    }

    this.actualizaTotales();

    return valido;

  }

  /**
   * Método lanzado al cambiar el ETA de los RPO existentes,
   * Llama a todas las validaciones RPO particulares.
   * @param index Índice para identificar el registro RPO.
   */
  etaValido(index: number) {
    
    this.ca2SdRpoValido(index);
    this.ca4SdRpoValido(index);
    this.ca4ShRpoValido(index);
  }


  /**
   * Validación del monto 2SD RPO de forma particular,
   * en caso de no cumplir con la condición, el monto lo iguala a 0.
   * @param index Índice para identificar el registro RPO
   */
  ca2SdRpoValido(index: number) {
    
    let caRpo2Sd = Number(this.forma.controls['rpoPlan']['controls'][index]['controls'].ca2SdRpo.value);

    let fecha = this.forma.controls['rpoPlan']['controls'][index]['controls'].etaRpo.value;
    
    let eta = new Date(fecha.substr(0,4), fecha.substr(5,2) - 1, fecha.substr(8,2));

    if(caRpo2Sd < 0 && (this.today.getTime() - eta.getTime())/1000/60/60/24 > 0) {

      this.forma.controls['rpoPlan']['controls'][index]['controls'].ca2SdRpo.setValue(0);

    }

    this.actualizaTotales();

  }

  /**
   * Validación del monto 4SD RPO de forma particular,
   * en caso de no cumplir con la condición, iguala el monto a 0.
   * @param index Índice para identificar el registro RPO.
   */
  ca4SdRpoValido(index: number) {
    
    let caRpo4Sd = Number(this.forma.controls['rpoPlan']['controls'][index]['controls'].ca4SdRpo.value);

    let fecha = this.forma.controls['rpoPlan']['controls'][index]['controls'].etaRpo.value;
    let eta = new Date(fecha.substr(0,4), fecha.substr(5,2) - 1, fecha.substr(8,2));

    if(caRpo4Sd < 0 && (this.today.getTime() - eta.getTime())/1000/60/60/24 > 0) {

      this.forma.controls['rpoPlan']['controls'][index]['controls'].ca4SdRpo.setValue(0);

    }

    this.actualizaTotales();

  }

  /**
   * Validación de 4SH RPO de forma particular,
   * en caso de no cumplir con la condición, iguala el monto a 0.
   * @param index Índice para identificar el registro RPO.
   */
  ca4ShRpoValido(index: number) {
    
    let caRpo4Sh = Number(this.forma.controls['rpoPlan']['controls'][index]['controls'].ca4ShRpo.value);

    let fecha = this.forma.controls['rpoPlan']['controls'][index]['controls'].etaRpo.value;
    let eta = new Date(fecha.substr(0,4), fecha.substr(5,2) - 1, fecha.substr(8,2));

    if(caRpo4Sh < 0 && (this.today.getTime() - eta.getTime())/1000/60/60/24 > 0) {

      this.forma.controls['rpoPlan']['controls'][index]['controls'].ca4ShRpo.setValue(0);

    }

    this.actualizaTotales();

  }

  /**
   * Método lanzado al hacer click en el boton "Exportar".
   * Exporta la proyección a excel.
   */
  exportar() {

    this.cargando = true;

    this.proyeccion.detalles = this.proyeccion.detalles.filter(d => d.fgRpoPlan === 'N');
    
    let rpoPlanes: RpoPlan[] = [];

    rpoPlanes = (this.forma.controls.rpoPlan as FormArray).getRawValue();
   
    rpoPlanes.forEach(rp => {

      rp.etaRpo = new Date(rp.etaRpo + 'T00:00:00.000');

      let detalle = new ProyeccionEquipoDet();
      
      detalle.alNave = rp.alNaveRpo;
      detalle.viaje = rp.viajeRpo;
      detalle.eta = rp.etaRpo;
      detalle.caRpo2Sd = rp.ca2SdRpo;
      detalle.caRpo4Sd = rp.ca4SdRpo;
      detalle.caRpo4Sh = rp.ca4ShRpo;
      detalle.fgRpoPlan = 'S';

      this.proyeccion.detalles.push(detalle);

    });

    let proyeccionEquipoExcel = {

      proyEquipo: this.proyeccion,
      proyVenta: this.proyeccionVenta,

    };
    
    this.rpoPlanService.registraRpoPlan(this.urls, this.token, rpoPlanes)
      .subscribe(
        res => {
          
          this.proyeccionService.generaExcel(this.token, this.urls, proyeccionEquipoExcel)
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
      
                  this.cargando = false;
      
                  this.fileService.deleteFile(this.urls, fileName, this.token)
                    .subscribe(del => {
                      console.log(del);
                    });
                  
                }
              });
      
            });
        },

        err => {

          console.error(err);
          this.cargando = false;

        }

      );
  }

}
