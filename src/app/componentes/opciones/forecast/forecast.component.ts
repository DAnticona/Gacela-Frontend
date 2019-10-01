import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Nave } from 'src/app/clases/nave';
import { Servicio } from 'src/app/clases/servicio';

import { ForecastService } from '../../../servicios/forecast.service';
import * as XLSX from 'xlsx';
import { ForecastDet } from 'src/app/clases/forecast-det';
import { ForecastCab } from '../../../clases/forecast-cab';
import { ParamsService } from '../../../servicios/params.service';


@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit {

  forecastUrl: string;
  token: string;
  error: string;
  reportUrl: string;
  fileName: string;

  naves: Nave[];
  filtroNaves: Nave[];
  servicios: Servicio[];


  forecasCab = new ForecastCab();
  dataFile: ForecastDet[];

  servicio = new Servicio();
  nave = new Nave();

  forecast: any[] = [];

  cargando = false;

  textLabel = 'Seleccione un Archivo';
  file: File = null;


  valido: boolean;

  mensajes: string[] = [];
  linea = true;
  pod = true;
  size = true;
  type = true;
  cnd = true;
  vgm = true;

  forecastForm = new FormGroup({
    servicio: new FormControl(this.servicio.codigo, [
      Validators.required
    ]),
    naveSearch: new FormControl(''),
    nave: new FormControl(this.nave.codigo, [
      Validators.required
    ]),
    file: new FormControl('', [
      Validators.required
    ])
  });

  get servicioForm() {
    return this.forecastForm.get('servicio');
  }

  get naveSearch() {
    return this.forecastForm.get('naveSearch');
  }

  get naveForm() {
    return this.forecastForm.get('nave');
  }

  get fileForm() {
    return this.forecastForm.get('file');
  }

  constructor(
    private forecastService: ForecastService,
    private paramsService: ParamsService)
  {

    this.token = this.paramsService.conexion.token;
    this.forecastUrl = this.paramsService.urls.forecastUrl;
    this.reportUrl = this.paramsService.urls.reportUrl;

    this.getData();
  }

  ngOnInit() {

  }

  getData() {

    this.forecastService.getData(this.forecastUrl, this.token).subscribe(
      res => {

        this.naves = res.body.naves;
        this.servicios = res.body.servicios;

        this.servicio = this.servicios[0];

        this.filtroNaves = this.naves.filter(
          nave => nave.servicio === this.servicio.codigo
        );

        this.nave = this.filtroNaves[0];

        this.naveForm.setValue(this.nave.codigo);
        this.servicioForm.setValue(this.servicio.codigo);

      },

      err => {

        this.error = `Status: ${err.status} Message: ${err.error}`;

      },

      () => {

      }
    );
  }

  onChangeServicio() {

    this.resetForm();

    let coServicio = this.servicioForm.value;


    for (let serv of this.servicios) {
      if (serv.codigo === coServicio) {
        this.servicio = serv;
        break;
      }
    }

    this.filtroNaves = this.naves.filter(
      nave => nave.servicio === this.servicio.codigo
    );

    this.getPrimeraNave(this.filtroNaves);

  }

  onClickNaves() {
    let coNave = this.naveForm.value;

    for (let nave of this.naves) {
      if (nave.codigo === coNave) {
        this.nave = nave;
        break;
      }
    }

  }

  search(term: string) {

    term = term.toUpperCase();

    this.filtroNaves = this.naves.filter(
      nave => (nave.longName.includes(term) || nave.shortName.includes(term)) && (nave.servicio === this.servicio.codigo)
    );

    this.getPrimeraNave(this.filtroNaves);

  }


  getPrimeraNave(filtroNaves: Nave[]) {

    if (filtroNaves.length) {

      this.naveForm.setValue(this.filtroNaves[0].codigo);
      let coNave = this.naveForm.value;

      for (let nave of this.naves) {
        if (nave.codigo === coNave) {
          this.nave = nave;
          break;
        }
      }

    } else {

      this.nave = null;

    }


  }


  resetForm() {

    this.fileForm.setValue(null);
    this.textLabel = 'Seleccione un Archivo';
    this.file = null;

    this.valido = null;

    this.mensajes = [];
    this.linea = true;
    this.pod = true;
    this.size = true;
    this.type = true;
    this.cnd = true;
    this.vgm = true;

  }


  onChangeFile(fileInput: any) {

    this.mensajes = [];
    this.valido = null;

    let file = fileInput.files.item(0);


    if (file) {
      this.textLabel = file.name;

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

        this.dataFile = [];

        dataCruda.forEach((item, i) => {

          let dpw = new ForecastDet();

          dpw.linea = String(item['LINEA']);
          dpw.pol = String(item['POD']);
          dpw.pod = String(item['POD']);
          dpw.size = Number(item['SIZE']);
          dpw.type = String(item['TYPE']);
          dpw.cnd = String(item['CND']);
          dpw.vgm = Number(item['VGM(KG)']);
          dpw.nbrCont = String(item['CONTAINER NBR']);
          dpw.imo = String(item['IMO']);
          dpw.un = String(item['UN']);
          dpw.temperature = String(item['TEMPERATURE']);

          this.dataFile.push(dpw);
        });

        this.validaData(this.dataFile);

        if (this.mensajes.length === 0) {

          this.valido = true;
          this.mensajes.push('Validación exitosa');

        } else {

          this.valido = false;

        }
      };

      fileReader.readAsArrayBuffer(file);

    } else {

      this.textLabel = 'Seleccione un Archivo';

    }
  }




  validaColumnas(data: object[]) {

    if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'LINEA').length > 1) {
      this.mensajes.push('Existen múltiples columnas LINEA');
    } else if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'LINEA').length === 0) {
      this.mensajes.push('Columna LINEA NO existe');
      this.linea = false;
    }

    if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'POD').length > 1) {
      this.mensajes.push('Existen múltiples columnas POD');
    } else if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'POD').length === 0) {
      this.mensajes.push('Columna POD NO existe');
      this.pod = false;
    }

    if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'SIZE').length > 1) {
      this.mensajes.push('Existen múltiples columnas SIZE');
    } else if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'SIZE').length === 0) {
      this.mensajes.push('Columna SIZE NO existe');
      this.size = false;
    }

    if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'TYPE').length > 1) {
      this.mensajes.push('Existen múltiples columnas TYPE');
    } else if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'TYPE').length === 0) {
      this.mensajes.push('Columna TYPE NO existe');
      this.type = false;
    }

    if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'CND').length > 1) {
      this.mensajes.push('Existen múltiples columnas CND');
    } else if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'CND').length === 0) {
      this.mensajes.push('Columna CND NO existe');
      this.cnd = false;
    }

    if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'VGM(KG)').length > 1) {
      this.mensajes.push('Existen múltiples columnas VGM(KG)');
    } else if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'VGM(KG)').length === 0) {
      this.mensajes.push('Columna VGM(KG) NO existe');
      this.vgm = false;
    }

    if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'IMO').length > 1) {
      this.mensajes.push('Existen múltiples columnas IMO');
    }

    if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'UN').length > 1) {
      this.mensajes.push('Existen múltiples columnas UN');
    }

    if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'TEMPERATURE').length > 1) {
      this.mensajes.push('Existen múltiples columnas TEMPERATURE');
    }

  }

  validaData(data: Array<ForecastDet>) {

    data.forEach((row, index) => {

      if (this.linea) {
        if (!row.linea) {
          this.mensajes.push(`Fila ${index + 2} Columna LINEA: Celda vacía`);
        } else {
          row.linea = row.linea.trim().toUpperCase();
        }
      }

      if (this.pod) {
        if (!row.pod) {
          this.mensajes.push(`Fila ${index + 2} Columna POD: Celda vacía`);
        } else if (this.servicio.puertos.filter(puer => (puer.coIso === row.pod.toUpperCase())).length === 0) {
          this.mensajes.push(`Fila ${index + 2} Columna POD: puerto no válido para el servicio seleccionado`);
        } else {
          row.pod = row.pod.trim().toUpperCase();
        }
      }

      if (this.size) {
        if (!row.size) {
          this.mensajes.push(`Fila ${index + 2} Columna SIZE: Celda vacía, con valor 0, o datos no válidos`);
        } else if (!(row.size === 20 || row.size === 40)) {
          this.mensajes.push(`Fila ${index + 2} Columna SIZE: El valor solo debe ser 20 ó 40`);
        }
      }

      if (this.type) {
        if (!row.type) {
          this.mensajes.push(`Fila ${index + 2} Columna TYPE: Celda vacía`);
        } else if (!(row.type.toUpperCase() === 'DR' || row.type.toUpperCase() === 'ST' ||
          row.type.toUpperCase() === 'PL' || row.type.toUpperCase() === 'FC' ||
          row.type.toUpperCase() === 'OT' || row.type.toUpperCase() === 'FO' ||
          row.type.toUpperCase() === 'RH' || row.type.toUpperCase() === 'HC' ||
          row.type.toUpperCase() === 'SD' || row.type.toUpperCase() === 'FR' ||
          row.type.toUpperCase() === 'SH')) {
          this.mensajes.push(`Fila ${index + 2} Columna TYPE: Contiene datos inválidos`);
        } else {
          row.type = row.type.trim().toUpperCase();
        }
      }

      if (this.cnd) {
        if (!row.cnd) {
          this.mensajes.push(`Fila ${index + 2} Columna CND: Celda vacía`);
        } else if (!(row.cnd.toUpperCase() === 'F' || row.cnd.toUpperCase() === 'E')) {
          this.mensajes.push(`Fila ${index + 2} Columna CND: Contiene datos inválidos, solo se permiten F o E`);
        } else {
          row.cnd = row.cnd.trim().toUpperCase();
        }
      }

      if (this.vgm) {
        if (!row.vgm) {
          this.mensajes.push(`Fila ${index + 2} Columna VGM(KG): Celda vacía, con valor 0 ó datos no válidos`);
        } else if (row.vgm < 2000) {
          this.mensajes.push(`Fila ${index + 2} Columna VGM(KG): no puede ser menor a 2000`);
        }
      }
    });
  }


  onProcesar() {

    if (!this.valido) {

      this.error = `Debe seleccionar un SERVICIO, una NAVE y un ARCHIVO válidos`;

    } else {

      this.cargando = true;

      this.forecasCab.coNave = this.nave.codigo;
      this.forecasCab.noNave = this.nave.longName;
      this.forecasCab.alNave = this.nave.shortName;
      this.forecasCab.coServ = this.servicio.codigo;
      this.forecasCab.noServ = this.servicio.nombre;
      this.forecasCab.detalles = this.dataFile;

      this.forecastService.loadFile(this.forecastUrl, this.forecasCab, this.token)
        .subscribe(res => {
          // console.log(res);
          this.fileName = res.body['mensaje'];
          // console.log(fileName);
          window.open(`${this.reportUrl}/${this.fileName}`, '_blank');
          this.cargando = false;

        });
    }
  }


  deleteFile(url: string, fileName: string) {

    this.forecastService.deleteFile(`${url}${fileName}`, this.token)
      .subscribe(res => {
        console.log(res);
      });

  }
}
