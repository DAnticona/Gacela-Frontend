import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { LoginService } from '../../servicios/login.service';
import { Login } from '../../clases/login';
import { Config } from '../../interfaces/config';
import { ConfigService } from '../../servicios/config.service';
import { Usuario } from '../../clases/usuario';
import { Log } from '../../clases/log';

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
      'usuario': new FormControl(this.login.usuario, [
        Validators.required
      ]),
      'password': new FormControl(this.login.password, [
        Validators.required
      ]),
    });
  }

  get usuario() { 
    return this.loginForm.get('usuario'); 
  }
  
  get password() { 
    return this.loginForm.get('password');
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
      
      usuarioConectado => this.usuarioConectado = {
        
        coUsua: usuarioConectado['coUsua'],
        noUsua: usuarioConectado['noUsua'],
        feUltSes: usuarioConectado['feUltSes'],
        usCreaUsua: usuarioConectado['usCreaUsua'],
        usModiUsua: usuarioConectado['usModiUsua'],
        feCreaUsua: usuarioConectado['feCreaUsua'],
        feModiUsua: usuarioConectado['feModiUsua'],
        coPers: usuarioConectado['coPers'],
        nuDocu: usuarioConectado['nuDocu'],
        noPers: usuarioConectado['noPers'],
        apPate: usuarioConectado['apPate'],
        apMate: usuarioConectado['apMate'],
        sexo: usuarioConectado['sexo'],
        feNaci: usuarioConectado['feNaci'],
        usCreaPers: usuarioConectado['usCreaPers'],
        usModiPers: usuarioConectado['usModiPers'],
        feCreaPers: usuarioConectado['feCreaPers'],
        feModiPers: usuarioConectado['feModiPers']
        
      },
      
      log => this.log = {
        mensaje: log['mensaje'],
        codigo: log['codigo'],
        estado: log['estado'],
        nombreClase: log['nombreClase'],
        exception: log['exception']
      },

      () => {
        this.loginService.routeWelcomePage();
      }
      
    );
  }
  
}
