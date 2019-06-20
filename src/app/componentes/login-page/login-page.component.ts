import { Component, OnInit } from '@angular/core';

import { LoginService } from '../../servicios/login.service';
import { Login } from '../../clases/login';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Config } from '../../interfaces/config';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  loginForm: FormGroup;
  login = new Login();

  config: Config;

  constructor(private loginService: LoginService) { }

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
    this.loginService.getConfig().subscribe(
      (data: Config) => this.config = {
        loginUrl: data['loginUrl']
      },
    );
  }

  onSubmit(){

    this.loginService.login(this.loginForm.value, this.config).subscribe(
      usuario => console.log(usuario)
    );

  }
}
