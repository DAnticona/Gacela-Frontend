import { Component, OnInit } from '@angular/core';
import { CalendarioService } from '../../../servicios/calendario.service';
import { ParamsService } from 'src/app/servicios/params.service';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {

  
  token: string;
  urls: any;

  today = new Date();
  fechaFin = new Date();
  calendario: any[] = [];

  // fecha = this.today;
  mes: number = this.today.getMonth();
  meses = [1,2,3,4,5,6,7,8,9,10,11,12];
  anos = [2019,2020,2021,2022,2023,2024,2025];
  // dia: number;
  ano: number = this.today.getFullYear();
  // diaSem: number;
  // semMes: number;


  feriados: any[] = [];
  multiselect = true;

  MESES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio','Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor(private calendarioService: CalendarioService,
              private paramsService: ParamsService) { 

    this.token = this.paramsService.conexion.token;
    this.urls = this.paramsService.urls;



    this.calendarioService.getCalendario(this.token, this.urls, '2020-01-01', '2020-02-20')
      .subscribe((res: any) => {

        this.calendario = res.body.calendario;
        // console.log(this.calendario);
        
        this.feriados = this.calendario.filter(feriado => feriado.mes === this.mes + 1 && feriado.ano === this.ano);

        // console.log(this.feriados);
        

      }
    );
  }

  ngOnInit() {
  }



  cambiaMes(mes: number) {

    // console.log(this.feriados);

    // console.log(mes);

    this.mes = mes;

    // console.log(this.mes + 1);
    // console.log(this.ano);

    this.feriados = this.calendario.filter(feriado => feriado.mes === this.mes && feriado.ano === this.ano);
    // console.log(this.calendario);
    // console.log(this.calendario.filter(feriado => feriado.mes === 1 && feriado.ano === 2019));

  }

  cambiaAno(ano: number) {

    // console.log(ano);

    this.ano = ano;

    // console.log(this.mes);
    // console.log(this.ano);

    this.feriados = this.calendario.filter(feriado => feriado.mes === this.mes && feriado.ano === this.ano);

    // console.log(this.feriados);
    // console.log(this.calendario);
  }

}
