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

  usuario: any;
  perfil: any;
  menus: any;
  conexion: any;

  cargando = false;

  constructor(private paramsService: ParamsService,
              private router: Router) {

      this.paramsService.getUrls()
        .subscribe(res => {

          this.urls = res;
          // console.log(this.urls);
          
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
          this.usuario = res.body.usuario;
          this.perfil = res.body.usuario.perfil;
          this.menus = res.body.usuario.perfil.menus;

          // console.log(this.usuario);
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
    this.paramsService.guardarUsuario(this.usuario);
    this.paramsService.guardarPerfil(this.perfil);
    this.paramsService.guardarMenus(this.menus);
    
    this.router.navigate(['welcome/home', this.usuario.noUsua.toLowerCase()]);

  }

}
