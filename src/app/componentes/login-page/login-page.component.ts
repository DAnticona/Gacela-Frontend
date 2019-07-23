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
        loginUrl: data['loginUrl'],
        logoutUrl: data['logoutUrl']
      },
    );
  }

  onSubmit(){

    this.loginService.login(this.loginForm.value, this.config).subscribe(
      
      res => this.usuarioConectado = {
        
        nombre: res.nombre,
        sexo: res.sexo,
        usuario: res.usuario,
        perfil: res.perfil,
        menus: res.menus
      },
      
      err => this.log = {
        mensaje: err['mensaje'],
        codigo: err['codigo'],
        estado: err['estado'],
        nombreClase: err['nombreClase'],
        exception: err['exception']
      },

      () => {
        this.loginService.routeWelcomePage(this.usuarioConectado);
      }
      
    );
  }
  
}
