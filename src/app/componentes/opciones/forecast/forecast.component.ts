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

  dataForecast: DataForecast;
  naves: Nave[];
  filtroNaves: Nave[];
  servicios: Servicio[];

  servicio = new Servicio();
  nave = new Nave();

  term = '';

  textLabel = 'Seleccione un Archivo';
  file: File = null;
  arrayBuffer: any;
  result: object[];
  
  valido: string;

  mensajes: Array<string>;
  linea = true;
  pod= true;
  size= true;
  type= true;
  cnd= true;
  vgm= true;

  forecastForm = new FormGroup({
    servicio: new FormControl(this.servicio.codigo, [
      Validators.required
    ]),
    nave: new FormControl(this.nave.codigo, [
      Validators.required
    ]),
    file: new FormControl('', [
      Validators.required
    ])
  });

  constructor(
    private forecastService: ForecastService,
    private parameterService: ParameterService
  ) {

    this.url = this.parameterService.getConfig().forecastUrl;
    this.token = this.parameterService.getToken().token;

    this.getData();
  }

  ngOnInit() {

  }

  get servicioForm() { 
    return this.forecastForm.get('servicio');
  }

  get naveForm() { 
    return this.forecastForm.get('nave');
  }

  get fileForm() { 
    return this.forecastForm.get('file');
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

        this.servicio = this.servicios[0];
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


  onClickNaves() {
    const coNave = this.naveForm.value;
    // const coNave = event.target.value;
    for (const nave of this.naves) {
      if (nave.codigo === coNave) {
        this.nave = nave;
        break;
      }
    }

    console.log(this.nave);
    
  }

  onChangeServicio() {

    const coServicio = this.servicioForm.value;

    for (const serv of this.servicios) {
      if (serv.codigo === coServicio) {
        this.servicio = serv;
        break;
      }
    }

    this.filtroNaves = null;

    if (!this.term.trim()) {

      this.filtroNaves = this.naves.filter(
        nave => nave.servicio === this.servicio.codigo
      );

    } else {

      this.filtroNaves = this.naves.filter(
        nave => ((nave.longName.includes(this.term) || nave.shortName.includes(this.term)) && (nave.servicio === this.servicio.codigo))
      );

    }
    
    this.naveForm.setValue(this.filtroNaves[0].codigo);
    const coNave = this.naveForm.value;

    for (const nave of this.naves) {
      if (nave.codigo === coNave) {
        this.nave = nave;
        break;
      }
    }

    console.log(this.servicio);
    console.log(this.nave);

  }





  search(term: string) {

    this.term = term.toUpperCase();

    if (!this.term.trim()) {
      this.filtroNaves = this.naves.filter(
        nave => nave.servicio === this.servicio.codigo
      );
    } else {
      this.filtroNaves = this.naves.filter(
        nave => (nave.longName.includes(this.term) || nave.shortName.includes(this.term)) && (nave.servicio === this.servicio.codigo)
      );
    }

  }





  onChangeFile(event) {

    this.mensajes = null;
    this.valido = null;

    const file = event.target.files.item(0);

    if (file) {
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

        const dataCruda: object[] = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: null });

        this.mensajes = new Array<string>();

        this.validaColumnas(dataCruda);

        const result = new Array<Dpw>();

        dataCruda.forEach((item, i) => {
          const dpw = new Dpw();

          dpw.linea = item['LINEA'];
          dpw.pod = item['POD'];
          dpw.size = item['SIZE'];
          dpw.type = item['TYPE'];
          dpw.cnd = item['CND'];
          dpw.vgm = item['VGM(KG)'];

          result.push(dpw);
        });

        this.validaData(result);

        if (this.mensajes.length === 0) {
          this.valido = 'Validación Exitosa';
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

  }

  validaData(data: Array<Dpw>) {

    data.forEach((row, index) => {

      if (this.linea && !row.linea) {
        this.mensajes.push(`Fila ${index + 2} Columna LINEA: Celda vacía`);
      }
      
      if(this.pod) {
        if (!row.pod) {
          this.mensajes.push(`Fila ${index + 2} Columna POD: Celda vacía`);
        } else if (this.servicio.puertos.filter(puer => (puer.coIso === row.pod)).length === 0) {
          this.mensajes.push(`Fila ${index + 2} Columna POD: puerto no válido para el servicio seleccionado`);
        }
      }
      
      if (this.size && !row.size) {
        this.mensajes.push(`Fila ${index + 2} Columna SIZE: Celda vacía o con valor 0`);
      }

      if (this.type && !row.type) {
        this.mensajes.push(`Fila ${index + 2} Columna TYPE: Celda vacía`);
      }

      if (this.cnd && !row.cnd) {
        this.mensajes.push(`Fila ${index + 2} Columna CND: Celda vacía`);
      }

      if(this.vgm) {
        if (!row.vgm) {
          this.mensajes.push(`Fila ${index + 2} Columna VGM(KG): Celda vacía o con valor 0`);
        } else if (row.vgm < 2000) {
          this.mensajes.push(`Fila ${index + 2} Columna VGM(KG): no puede ser menor a 2000`);
        }
      }
    });
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


  onProcesar() {
    // this.loadFile();
    // this.validaFile(this.result);
  }
}
