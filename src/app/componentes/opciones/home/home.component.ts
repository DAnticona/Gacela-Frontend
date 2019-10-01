import { Component, OnInit } from '@angular/core';
import { ParamsService } from '../../../servicios/params.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usuario: any;
  perfil: any;

  constructor(private paramsService: ParamsService) {

    this.usuario = this.paramsService.usuario;
    this.perfil = this.paramsService.perfil;

   }

  ngOnInit() {
  }

}
