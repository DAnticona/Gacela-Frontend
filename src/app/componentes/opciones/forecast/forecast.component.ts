import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

import { DataForecast } from '../../../interfaces/data-forecast';
import { Nave } from 'src/app/clases/nave';
import { Servicio } from 'src/app/clases/servicio';

import { ForecastService } from '../../../servicios/forecast.service';
import { ParameterService } from '../../../servicios/parameter.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit {

  url: string;
  token: string;
  error: string;

  forecastForm: FormGroup;

  dataForecast: DataForecast;
  naves: Nave[];
  filtroNaves: Nave[];
  servicios: Servicio[];

  coServicio: string;
  term: string = '';

  constructor(
    private forecastService: ForecastService,
    private parameterService: ParameterService
  ) { 

    this.url = this.parameterService.getConfig().forecastUrl;
    this.token = this.parameterService.getToken().token;

    this.getData();
  }

  ngOnInit() {

    this.forecastForm = new FormGroup({
      'servicio': new FormControl('', [
        Validators.required
      ]),
      'nave': new FormControl('', [
        Validators.required
      ]),
    });

  }

  get f() {

    return this.forecastForm.controls;

  }

  onClickServicio(event: any){

    this.coServicio = event.target.id;

    if(!this.term.trim()){

      this.filtroNaves = this.naves.filter(
        nave => nave.servicio.localeCompare(this.coServicio)
      );

    } else{

      this.filtroNaves = this.naves.filter(
        nave => (nave.longName.includes(this.term) || nave.shortName.includes(this.term)) && nave.servicio.localeCompare(this.coServicio)
      );

    }

  }

  search(term: string){

    this.term = term;

    if(!this.term.trim()){
      this.filtroNaves = this.naves.filter(
        nave => nave.servicio.localeCompare(this.coServicio)
      );
    } else{
      this.filtroNaves = this.naves.filter(
        nave => (nave.longName.includes(this.term) || nave.shortName.includes(this.term)) && nave.servicio.localeCompare(this.coServicio)
      );
    }
  }

  getData(){

    this.forecastService.getData(this.url, this.token).subscribe(
      res => {

        this.dataForecast = {

          naves: res.body['naves'],
          servicios: res.body['servicios']

        }

        this.naves = this.dataForecast.naves;
        this.servicios = this.dataForecast.servicios;

      },

      err => {

        this.error = `Status: ${err.status} Message: ${err.error}`;

      },

      () => {

        

      }
    )

  }
}
