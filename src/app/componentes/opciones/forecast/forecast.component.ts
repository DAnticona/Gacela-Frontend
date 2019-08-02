import { Component, OnInit, ViewChild, ElementRef, Renderer2, ɵConsole } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { DataForecast } from '../../../interfaces/data-forecast';
import { Nave } from 'src/app/clases/nave';
import { Servicio } from 'src/app/clases/servicio';

import { ForecastService } from '../../../servicios/forecast.service';
import { ParameterService } from '../../../servicios/parameter.service';
import * as XLSX from 'xlsx';
import { Dpw } from 'src/app/clases/dpw';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit {

  @ViewChild('inputFileLabel', { static: false }) inputFileLabel: ElementRef;

  url: string;
  token: string;
  error: string;

  forecastForm: FormGroup;

  dataForecast: DataForecast;
  naves: Nave[];
  filtroNaves: Nave[];
  servicios: Servicio[];

  coServicio: string;
  term = '';

  textLabel = 'Seleccione un Archivo';
  file: File = null;
  arrayBuffer: any;
  result: object[];
  valido: string;

  linea: string;
  pod: string;
  size: string;
  type: string;
  cnd: string;
  vgm: string;

  lineaData: string;
  podData: string;
  sizeData: string;
  typeData: string;
  cndData: string;
  vgmData: string;

  constructor(
    private forecastService: ForecastService,
    private parameterService: ParameterService,
    private renderer: Renderer2,
  ) {

    this.url = this.parameterService.getConfig().forecastUrl;
    this.token = this.parameterService.getToken().token;

    this.getData();
  }

  ngOnInit() {

    this.forecastForm = new FormGroup({
      servicio: new FormControl('', [
        Validators.required
      ]),
      nave: new FormControl('', [
        Validators.required
      ]),
      file: new FormControl('')
    });

  }

  get f() {

    return this.forecastForm.controls;

  }

  onClickServicio(event: any) {

    this.coServicio = event.target.id;
    this.filtroNaves = null;

    if (!this.term.trim()) {

      this.filtroNaves = this.naves.filter(
        nave => nave.servicio === this.coServicio
      );

    } else {

      this.filtroNaves = this.naves.filter(
        nave => ((nave.longName.includes(this.term) || nave.shortName.includes(this.term)) && (nave.servicio === this.coServicio))
      );

    }

  }

  search(term: string) {

    this.term = term.toUpperCase();

    if (!this.term.trim()) {
      this.filtroNaves = this.naves.filter(
        nave => nave.servicio === this.coServicio
      );
    } else {
      this.filtroNaves = this.naves.filter(
        nave => (nave.longName.includes(this.term) || nave.shortName.includes(this.term)) && (nave.servicio === this.coServicio)
      );
    }

  }

  getData() {

    this.forecastService.getData(this.url, this.token).subscribe(
      res => {

        this.dataForecast = {

          naves: res.body.naves,
          servicios: res.body.servicios

        };

        this.naves = this.dataForecast.naves;
        this.servicios = this.dataForecast.servicios;

        this.filtroNaves = this.naves.filter(
          nave => nave.servicio === this.servicios[0].codigo
        );

      },

      err => {

        this.error = `Status: ${err.status} Message: ${err.error}`;

      },

      () => {

      }
    );
  }


  onChangeFile(event) {

    this.linea = null;
    this.pod = null;
    this.size = null;
    this.type = null;
    this.cnd = null;
    this.vgm = null;

    this.lineaData = null;
    this.podData = null;
    this.sizeData = null;
    this.typeData = null;
    this.cndData = null;
    this.vgmData = null;

    this.valido = null;

    const file = event.target.files.item(0);
    this.textLabel = file.name;

        /*
    console.log(this.forecastForm.value.servicio);
    console.log(this.forecastForm.value.nave);
    console.log(this.textLabel);
    console.log(files.item(0));
*/
    const fileReader = new FileReader();

    fileReader.onload = (e) => {

      this.arrayBuffer = fileReader.result;

      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();

      for (let i = 0; i < data.length; ++i) {

        arr[i] = String.fromCharCode(data[i]);

      }

      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const result: object[] = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: null });
      
      const d: object[] = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: null });
      let dpw = new Dpw();
      let result2 = new Array<Dpw>();

      d.forEach((item, i) => {
        console.log(`${i}: ${item['LINEA']}`);
        dpw.linea = item['LINEA'];
        dpw.pod = item['POD'];
        dpw.size = item['SIZE'];
        dpw.type = item['TYPE'];
        dpw.cnd = item['CND'];
        dpw.vgm = item['VGM(KG)'];

        result2.push(dpw);
      });

      console.log(result2);
      /*
      const XL_row_object = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: null });
      const json_object = JSON.stringify(XL_row_object);
      XL_row_object.forEach(obj => {
        Object.keys(obj).forEach(key => key.replace('VGM(KG)','VGM'));
      });
      */
      // console.log(XL_row_object);
      

      this.validaFile(result);

    };

    fileReader.readAsArrayBuffer(file);

  }


  onProcesar() {
    // this.loadFile();
    // this.validaFile(this.result);
  }

  validaFile(data: object[]) {

    if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'LINEA').length > 1) {
      this.linea = 'Existen múltiples columnas LINEA';
    } else if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'LINEA').length === 0) {
      this.linea = 'Columna LINEA NO existe';
    }

    if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'POD').length > 1) {
      this.pod = 'Existen múltiples columnas POD';
    } else if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'POD').length === 0) {
      this.pod = 'Columna POD NO existe';
    }

    if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'SIZE').length > 1) {
      this.size = 'Existen múltiples columnas SIZE';
    } else if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'SIZE').length === 0) {
      this.size = 'Columna SIZE NO existe';
    }

    if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'TYPE').length > 1) {
      this.type = 'Existen múltiples columnas TYPE';
    } else if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'TYPE').length === 0) {
      this.type = 'Columna TYPE NO existe';
    }

    if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'CND').length > 1) {
      this.cnd = 'Existen múltiples columnas CND';
    } else if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'CND').length === 0) {
      this.cnd = 'Columna CND NO existe';
    }

    if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'VGM(KG)').length > 1) {
      this.vgm = 'Existen múltiples columnas VGM(KG)';
    } else if (Object.keys(data[0]).filter(key => key.toUpperCase() === 'VGM(KG)').length === 0) {
      this.vgm = 'Columna VGM(KG) NO existe';
    }

    data.forEach((row, index) => {
      if(!row['LINEA']) {
        this.lineaData = `Problemas con la fila ${index + 2} de la columna LINEA`;
      }
      if(!row['POD']) {
        this.podData = `Problemas con la fila ${index + 2} de la columna POD`;
      }
      if(!row['SIZE']) {
        this.sizeData = `Problemas con la fila ${index + 2} de la columna SIZE`;
      }
      if(!row['TYPE']) {
        this.typeData = `Problemas con la fila ${index + 2} de la columna TYPE`;
      }
      if(!row['CND']) {
        this.cndData = `Problemas con la fila ${index + 2} de la columna CND`;
      }

      /*
      if(!row.LINEA) {
        this.lineaData = `Problemas con la fila ${index + 2} de la columna LINEA`;
      }
      */
    });

    if (!this.linea && !this.pod && !this.size && !this.type && !this.cnd && !this.vgm && !this.lineaData && !this.podData && !this.sizeData && !this.typeData && !this.cndData && !this.vgmData) {
      this.valido = 'Validación Exitosa';
    }
    /*
    console.log(`linea: ${this.lineaData}`);
    console.log(`pod: ${this.podData}`);
    console.log(`size: ${this.sizeData}`);
    console.log(`type: ${this.typeData}`);
    console.log(`cnd: ${this.cndData}`);
    console.log(`vgm: ${this.vgmData}`);
    console.log(this.valido);
    */
  }
}
