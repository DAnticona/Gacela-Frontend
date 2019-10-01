import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../servicios/config.service';
import { LoginService } from '../../servicios/login.service';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.css']
})
export class StatusBarComponent implements OnInit {

  servidor: string;
  dataBase: string;

  constructor(private loginService: LoginService) {
    
    this.servidor = loginService.conexion.servidor;
    this.dataBase = loginService.conexion.dataBase.split('=')[1];
  }

  ngOnInit() {
  }

}
