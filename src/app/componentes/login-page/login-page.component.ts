import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Config } from '../../interfaces/config';
import { Login } from '../../clases/login';
import { Usuario } from '../../clases/usuario';
import { Token } from '../../clases/token';

import { ConfigService } from '../../servicios/config.service';
import { LoginService } from '../../servicios/login.service';
import { ParameterService } from '../../servicios/parameter.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  error: string;

  loginForm: FormGroup;

  login = new Login();
  config: Config;
  usuario: Usuario;
  token: Token;
  headers: string[];


  constructor(
    private router: Router,
    private loginService: LoginService,
    private configService: ConfigService,
    private parameterService: ParameterService
  ) { }

  ngOnInit() {

    this.getConfig();

    this.loginForm = new FormGroup({
      noUsua: new FormControl(this.login.noUsua, [
        Validators.required
      ]),
      pasUsua: new FormControl(this.login.pasUsua, [
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

  getConfig() {

    this.configService.getConfig().subscribe(
      (data: Config) => this.config = {
        loginUrl: data.loginUrl,
        logoutUrl: data.logoutUrl,
        forecastUrl: data.forecastUrl
      },
    );

  }

  onSubmit() {

    this.loginService.login(this.loginForm.value, this.config).subscribe(

      res => {

        this.token = {
          token:  res.headers.get('token')
        };

        this.usuario = {

          nombre: res.body.nombre,
          sexo: res.body.sexo,
          usuario: res.body.usuario,
          perfil: res.body.perfil,
          menus: res.body.menus

        };
      },

      err => {
        this.error = `Status: ${err.status} Message: ${err.error}`;
      },

      () => {
        this.routeWelcomePage(this.usuario);
      }
    );

  }


  routeWelcomePage(usuario: Usuario) {

    this.loadParameters();
    this.router.navigate([`welcome/${usuario.usuario.toLowerCase()}`]);

  }

  loadParameters() {

    this.parameterService.setConfig(this.config);
    this.parameterService.setToken(this.token);
    this.parameterService.setUsuario(this.usuario);

  }


}
