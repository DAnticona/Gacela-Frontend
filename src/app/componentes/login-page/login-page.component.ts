import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Login } from '../../clases/login';

import { LoginService } from '../../servicios/login.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent  {

  error: string;

  login = new Login();
  config: any;
  usuario: any;
  token: string;
  headers: string[];

  cargando = false;

  loginForm = new FormGroup({
    noUsua: new FormControl(this.login.noUsua, [
      Validators.required
    ]),
    pasUsua: new FormControl(this.login.pasUsua, [
      Validators.required
    ]),
  });


  constructor(private loginService: LoginService) { }

  get noUsua() {
    return this.loginForm.get('noUsua');
  }

  get pasUsua() {
    return this.loginForm.get('pasUsua');
  }


  onSubmit() {

    this.cargando = true;

    this.loginService.getLogin(this.loginForm.value).subscribe(

      res => {
        this.token = res.headers.get('token');
        this.usuario = res.body;
        this.cargaLogin();
      },

      err => {
        this.error = `Status: ${err.status} Message: ${err.error}`;
        this.cargando = false;
      },
    );

  }


  cargaLogin() {

    this.loginService.guardarDatos(this.usuario, this.token);
    this.loginService.routeWelcomePage(this.usuario.usuario.toLowerCase());

  }

}
