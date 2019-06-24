import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';


import { Config } from '../../interfaces/config';
import { Login } from '../../clases/login';
import { Usuario } from '../../clases/usuario';
import { Log } from '../../clases/log';

import { ConfigService } from '../../servicios/config.service';
import { LoginService } from '../../servicios/login.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  loginForm: FormGroup;
  login = new Login();
  config: Config;
  usuarioConectado: Usuario;
  log: Log;

  constructor(
    private loginService: LoginService, 
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.showConfig();

    this.loginForm = new FormGroup({
      'noUsua': new FormControl(this.login.noUsua, [
        Validators.required
      ]),
      'pasUsua': new FormControl(this.login.pasUsua, [
        Validators.required
      ]),
    });
  }

  get noUsua() { 
    return this.loginForm.get('noUsua'); 
  }
  
  get pasUsua() { 
    return this.loginForm.get('pasUsua');
  }

  showConfig() {
    this.configService.getConfig().subscribe(
      (data: Config) => this.config = {
        loginUrl: data['loginUrl']
      },
    );
  }

  onSubmit(){

    this.loginService.login(this.loginForm.value, this.config).subscribe(
      
      res => this.usuarioConectado = {
        
        coUsua: res['coUsua'],
        noUsua: res['noUsua'],
        feUltSes: res['feUltSes'],
        usCreaUsua: res['usCreaUsua'],
        usModiUsua: res['usModiUsua'],
        feCreaUsua: res['feCreaUsua'],
        feModiUsua: res['feModiUsua'],
        coPers: res['coPers'],
        nuDocu: res['nuDocu'],
        noPers: res['noPers'],
        apPate: res['apPate'],
        apMate: res['apMate'],
        sexo: res['sexo'],
        feNaci: res['feNaci'],
        usCreaPers: res['usCreaPers'],
        usModiPers: res['usModiPers'],
        feCreaPers: res['feCreaPers'],
        feModiPers: res['feModiPers'],

        perfil: res['perfil'],

        subMenus: res['subMenus'],
        
      },
      
      err => this.log = {
        mensaje: err['mensaje'],
        codigo: err['codigo'],
        estado: err['estado'],
        nombreClase: err['nombreClase'],
        exception: err['exception']
      },

      () => {
        console.log(this.usuarioConectado);
        this.loginService.routeWelcomePage(this.usuarioConectado);
      }
      
    );
  }
  
}
