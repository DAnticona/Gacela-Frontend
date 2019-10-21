import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { ParamsService } from '../../servicios/params.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  urls: any;

  loginForm: FormGroup;

  error: any;

  conexion: any;

  cargando = false;

  constructor(private paramsService: ParamsService,
              private router: Router) {

      this.paramsService.getUrls()
        .subscribe(res => {

          this.urls = res;
          
        });


    this.loginForm = new FormGroup({

      'noUsua': new FormControl('', Validators.required),
      'paUsua': new FormControl('', Validators.required)

    });
  }


  onSubmit() {

    this.cargando = true;
    
    this.paramsService.getLogin(this.loginForm.value, this.urls)
      .subscribe(
        (res: any) => {

          this.conexion = res.body.conexion;

          this.cargaLogin();

          this.cargando = false;

        },
      
        (err: any) => {

          this.error = err.error.error;

          this.cargando = false;

        }
      );

  }


  cargaLogin() {

    this.paramsService.guardarUrls(this.urls);
    this.paramsService.guardarConexion(this.conexion);
    
    this.router.navigate(['welcome/home', this.loginForm.controls.noUsua.value.toLowerCase()]);

  }

}
