import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ParamsService } from '../../servicios/params.service';
import { PasswordService } from '../../servicios/password.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {

  noUsua: string;
  token: string;
  urls: any;

  forma: FormGroup;
  iguales = false;
  exito = false;
  cargando = false;
  error: string;

  constructor(private paramsService: ParamsService,
              private passwordService: PasswordService,
              private location: Location,
              private router: Router) {

    this.noUsua = this.paramsService.conexion.noUsua;
    this.token = this.paramsService.conexion.token;
    this.urls = this.paramsService.urls;

    this.forma = new FormGroup({

      'noUsua': new FormControl({value: this.noUsua, disabled: true}, Validators.required),
      'paUsua': new FormControl('', Validators.required),
      'password1': new FormControl('', Validators.required),
      'password2': new FormControl('', Validators.required)

    });

  }

  sonIguales(t1: string, t2: string) {

    if((t1 === t2) && t1.length > 0 && t2.length > 0) {

      this.iguales = true;

    } else {

      this.iguales = false;

    }

  }
  


  changePassword() {

    this.cargando = true;

    this.passwordService.changePassword(this.token, this.forma.getRawValue(), this.urls)
      .subscribe(
        res => {

          this.exito = true;
          this.cargando = false;
          setTimeout(() => this.logOut(), 3000);

        },
        (err: any) => {

          this.exito = false;
          this.cargando = false;
          this.error = err.error.error.mensaje;
          
        }
      );

  }

  logOut() {

    this.paramsService.getLogout(this.noUsua)
    .subscribe((res1: any) => {

      this.router.navigateByUrl('/login');

    });

  }


  onCancel() {

    this.location.back();

  }

}
