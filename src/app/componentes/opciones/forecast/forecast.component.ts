import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { ForecastCab } from 'src/app/models/forecastCab.model';
import { ForecastDet } from 'src/app/models/forecastDet.model';

import { ForecastService } from '../../../servicios/forecast.service';
import { ParamsService } from '../../../servicios/params.service';
import { ServicioService } from '../../../servicios/servicio.service';
import { NavesService } from '../../../servicios/naves.service';

import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { FileService } from '../../../servicios/file.service';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent {

  forma: FormGroup;

  // forecastUrl: string;
  urls: any;
  token: string;
  error: string;
  // reportUrl: string;
  
  naves: any[] = [];
  filtroNaves: any[] = [];
  servicios: any[] = [];


  forecastCab = new ForecastCab();
  forecastDet: ForecastDet[];

  cargando = false;

  fileLabel = 'Seleccione un Archivo';
  file: File = null;

  errorFile: string[] = [];
  warningFile: string[] = [];

  linea = true;
  pod = true;
  size = true;
  type = true;
  cnd = true;
  vgm = true;
  imo = true;
  un = true;

  constructor(private forecastService: ForecastService,
              private paramsService: ParamsService,
              private servicioService: ServicioService,
              private navesService: NavesService,
              private fileService: FileService) {

    this.forma = new FormGroup({

      'coForecast': new FormControl(''),
      'coServ': new FormControl('', Validators.required),
      'fgProp': new FormControl('', Validators.required),
      'coNave': new FormControl('', Validators.required),
      'detalle': new FormArray([], Validators.required)
                  
    });

    this.token = this.paramsService.conexion.token;
    this.urls = this.paramsService.urls;

    this.servicioService.getServicios(this.token, this.urls)
      .subscribe((ser: any) => {

        this.servicios = ser.body.servicios;

        this.navesService.getNaves(this.token, this.urls)
          .subscribe((nav: any) => {

            // console.log(nav);
  
            this.naves = nav.body.navesTemp;

            this.forecastCab.coServ = this.servicios[0].coServ;
            this.forecastCab.fgProp = 'S';
            this.filtroNaves = this.naves.filter(nave => nave.servicio === this.forecastCab.coServ && nave.fgPropLinea === this.forecastCab.fgProp);
            this.forecastCab.coNave = this.filtroNaves[0].codigo;

            this.forecastCab.detalle = new Array<ForecastDet>();

            this.forma.setValue(this.forecastCab);
            
          });
      });
  }

  onChangeService() {

    (this.forma.controls.detalle as FormArray).clear();
    
    this.fileLabel = 'Seleccione un archivo';
    this.errorFile = [];
    this.warningFile = [];
    

    this.filtroNaves = this.naves.filter(nave => nave.servicio === this.forma.controls.coServ.value && nave.fgPropLinea === this.forma.controls.fgProp.value);

    if(this.filtroNaves.length > 0) {

      this.forma.controls.coNave.setValue(this.filtroNaves[0].codigo);

    } else {

      this.forma.controls.coNave.setValue(null);

    }
    
  }

  search(naveSearch: string) {

    this.filtroNaves = this.naves.filter(nave => {
      return (nave.longName.includes(naveSearch.toUpperCase()) ||
              nave.shortName.includes(naveSearch.toUpperCase())) && 
              nave.servicio === this.forma.controls.coServ.value && 
              nave.fgPropLinea === this.forma.controls.fgProp.value;
    });

    
    if(this.filtroNaves.length === 0) {

      this.forma.controls.coNave.setValue(null);

    } else {

      this.forma.controls.coNave.setValue(this.filtroNaves[0].codigo);

    }

  }


  onChangeFile(fileInput: any) {

    this.errorFile = [];
    this.warningFile = [];

    this.file = fileInput.files.item(0);

    if (this.file) {

      this.fileLabel = this.file.name;

      let fileReader = new FileReader();

      fileReader.onload = (e) => {

        let arrayBuffer: any = fileReader.result;

        let uint8Array = new Uint8Array(arrayBuffer);
        let arrayAux = new Array();

        for (let i = 0; i < uint8Array.length; ++i) {

          arrayAux[i] = String.fromCharCode(uint8Array[i]);

        }

        let bstr = arrayAux.join('');
        let workbook = XLSX.read(bstr, { type: 'binary' });
        let firstSheetName = workbook.SheetNames[0];
        let worksheet = workbook.Sheets[firstSheetName];

        let dataCruda: object[] = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: null });

        this.validaColumnas(dataCruda);

        this.forecastDet = new Array<ForecastDet>();

        dataCruda.forEach((item, i) => {

          let detalle = new ForecastDet();

          detalle.linea = String(item['LINEA']);
          detalle.pol = String(item['POD']);
          detalle.pod = String(item['POD']);
          detalle.size = Number(item['SIZE']);
          detalle.type = String(item['TYPE']);
          detalle.cnd = String(item['CND']);
          detalle.vgm = Number(item['VGM(KG)']);
          detalle.nbrCont = String(item['CONTAINER NBR']);
          detalle.imo = String(item['IMO']);
          detalle.un = String(item['UN']);
          detalle.temperature = String(item['TEMPERATURE']);
          detalle.commodity = String(item['COMMODITY']);

          this.forecastDet.push(detalle);
        });

        this.validaData(this.forecastDet);

        this.forecastDet.forEach(det => {
          this.agregaDetalle(det);
        });
      };

      fileReader.readAsArrayBuffer(this.file);

    } else {

      this.fileLabel = 'Seleccione un archivo';

    }
  }


  agregaDetalle(det: ForecastDet) {

    let item = (this.forma.controls['detalle'] as FormArray).length + 1;

    (this.forma.controls['detalle'] as FormArray).push(

      new FormGroup({

        'coForecast': new FormControl(''),
        'item': new FormControl(item, Validators.required),
        'linea': new FormControl(det.linea, Validators.required),
        'pol': new FormControl(det.pol, Validators.required),
        'pod': new FormControl(det.pod, Validators.required),
        'size': new FormControl(det.size, Validators.required),
        'type': new FormControl(det.type, Validators.required),
        'cnd': new FormControl(det.cnd, Validators.required),
        'vgm': new FormControl(det.vgm, Validators.required),
        'nbrCont': new FormControl(det.nbrCont),
        'imo': new FormControl(det.imo),
        'un': new FormControl(det.un),
        'temperature': new FormControl(det.temperature),
        'commodity': new FormControl(det.commodity)

      })

    );
  }




  validaColumnas(data: object[]) {

    if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'LINEA').length > 1) {
      this.errorFile.push('Existen múltiples columnas LINEA');
    } else if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'LINEA').length === 0) {
      this.errorFile.push('Columna LINEA NO existe');
      this.linea = false;
    }

    if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'POD').length > 1) {
      this.errorFile.push('Existen múltiples columnas POD');
    } else if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'POD').length === 0) {
      this.errorFile.push('Columna POD NO existe');
      this.pod = false;
    }

    if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'SIZE').length > 1) {
      this.errorFile.push('Existen múltiples columnas SIZE');
    } else if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'SIZE').length === 0) {
      this.errorFile.push('Columna SIZE NO existe');
      this.size = false;
    }

    if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'TYPE').length > 1) {
      this.errorFile.push('Existen múltiples columnas TYPE');
    } else if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'TYPE').length === 0) {
      this.errorFile.push('Columna TYPE NO existe');
      this.type = false;
    }

    if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'CND').length > 1) {
      this.errorFile.push('Existen múltiples columnas CND');
    } else if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'CND').length === 0) {
      this.errorFile.push('Columna CND NO existe');
      this.cnd = false;
    }

    if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'VGM(KG)').length > 1) {
      this.errorFile.push('Existen múltiples columnas VGM(KG)');
    } else if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'VGM(KG)').length === 0) {
      this.errorFile.push('Columna VGM(KG) NO existe');
      this.vgm = false;
    }

    if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'IMO').length > 1) {
      this.errorFile.push('Existen múltiples columnas IMO');
    } else if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'IMO').length === 0) {
      this.imo = false;
    }

    if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'UN').length > 1) {
      this.errorFile.push('Existen múltiples columnas UN');
    } else if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'UN').length === 0) {
      this.un = false;
    }

    if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'TEMPERATURE').length > 1) {
      this.errorFile.push('Existen múltiples columnas TEMPERATURE');
    }

  }

  validaData(data: Array<ForecastDet>) {

    data.forEach((row, index) => {

      let servicioSeleccionado: any = this.servicios.filter(s => s.coServ === this.forma.controls.coServ.value)[0];

      if (this.linea) {
        if (!row.linea) {
          this.errorFile.push(`Fila ${index + 2} Columna LINEA: Celda vacía`);
        } else {
          row.linea = row.linea.trim().toUpperCase();
        }
      }

      if (this.pod) {
        if (!row.pod) {
          this.errorFile.push(`Fila ${index + 2} Columna POD: Celda vacía`);
        } else if (servicioSeleccionado.puertos.filter(puer => (puer.coIso === row.pod.toUpperCase())).length === 0) {
          this.errorFile.push(`Fila ${index + 2} Columna POD: puerto no válido para el servicio seleccionado`);
        } else {
          row.pod = row.pod.trim().toUpperCase();
        }
      }

      if (this.size) {
        if (!row.size) {
          this.errorFile.push(`Fila ${index + 2} Columna SIZE: Celda vacía, con valor 0, o datos no válidos`);
        } else if (!(row.size === 20 || row.size === 40)) {
          this.errorFile.push(`Fila ${index + 2} Columna SIZE: El valor solo debe ser 20 ó 40`);
        }
      }

      if (this.type) {
        if (!row.type) {
          this.errorFile.push(`Fila ${index + 2} Columna TYPE: Celda vacía`);
        } else if (!(row.type.toUpperCase() === 'DR' || row.type.toUpperCase() === 'ST' ||
                      row.type.toUpperCase() === 'PL' || row.type.toUpperCase() === 'FC' ||
                      row.type.toUpperCase() === 'OT' || row.type.toUpperCase() === 'FO' ||
                      row.type.toUpperCase() === 'RH' || row.type.toUpperCase() === 'HC' ||
                      row.type.toUpperCase() === 'SD' || row.type.toUpperCase() === 'FR' ||
                      row.type.toUpperCase() === 'SH')) {

          this.errorFile.push(`Fila ${index + 2} Columna TYPE: Contiene datos inválidos`);

        } else {
          row.type = row.type.trim().toUpperCase();
        }
      }

      if (this.cnd) {
        if (!row.cnd) {
          this.errorFile.push(`Fila ${index + 2} Columna CND: Celda vacía`);
        } else if (!(row.cnd.toUpperCase() === 'F' || row.cnd.toUpperCase() === 'E')) {
          this.errorFile.push(`Fila ${index + 2} Columna CND: Contiene datos inválidos, solo se permiten F o E`);
        } else {
          row.cnd = row.cnd.trim().toUpperCase();
        }
      }

      if (this.vgm) {
        if (!row.vgm) {
          this.errorFile.push(`Fila ${index + 2} Columna VGM(KG): Celda vacía, con valor 0 ó datos no válidos`);
        } else if (row.vgm < 2000) {
          this.errorFile.push(`Fila ${index + 2} Columna VGM(KG): no puede ser menor a 2000`);
        }
      }

      // VALIDACION DE COMBINACION IMO, UN, COMMDITY
      if(this.imo && this.un) {
        if(row.linea === 'EVG') {

          if(row.imo === '9' && row.un === '2216' && 
          !(row.commodity === 'FISHMEAL' || row.commodity === 'FISH MEAL')) {

            this.warningFile.push(`Fila ${index + 2}: Revisar IMO, UN y COMMODITY`);

          } else if(row.imo === '9' && row.un === '3359/2216' && 
          !(row.commodity === 'FISHMEAL' || row.commodity === 'FISH MEAL')) {

            this.warningFile.push(`Fila ${index + 2}: Revisar IMO, UN y COMMODITY`);
        
          } else if(row.imo === '9' && row.un === '2216/3359' && 
          !(row.commodity === 'FISHMEAL' || row.commodity === 'FISH MEAL')) {

            this.warningFile.push(`Fila ${index + 2}: Revisar IMO, UN y COMMODITY`);
      
          }
        }
      }
    });
  }


  onProcesar() {

    this.cargando = true;
     
    this.forecastCab = this.forma.getRawValue();

    // console.log(this.forecastCab);

      
    this.forecastService.loadFile(this.urls, this.forecastCab, this.token)
      .subscribe(
        (res: any) => {

          // console.log(res);
          
          let fileName = res.body.fileName;

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
        },

        (err: any) => {

          console.log(err);

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error.error.mensaje,
            footer: 'Comuníquese con el administrador del sistema',
            onClose: () => {
              this.cargando = false;
            }
          });
        }
      );

      
  }
}
