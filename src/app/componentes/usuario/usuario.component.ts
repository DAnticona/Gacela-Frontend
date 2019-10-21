import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { ParamsService } from '../../servicios/params.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioModel } from '../../models/usuario.model';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent {

  error: any;

  forma: FormGroup;
  usuarioModel: UsuarioModel;

  cargando = false;
  editable = true;

  tiDocus: any[] = [];

  token: string;
  noUsua: string;
  urls: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private usuarioService: UsuarioService,
              private paramsService: ParamsService) {

    this.noUsua = this.route.snapshot.paramMap.get('noUsua');
    this.token = this.paramsService.conexion.token;
    this.urls = this.paramsService.urls;

    this.usuarioService.getUsuario(this.noUsua, this.token, this.urls)
      .subscribe((res: any) => {

        this.tiDocus = res.body.tidocs;

        this.usuarioModel = res.body.usuario;

        let fechaStr = res.body.usuario.feNaci + 'T00:00:00';
        this.usuarioModel.feNaci = new Date(fechaStr);

        this.cargaForma();

      });


    this.forma = new FormGroup({

      'coPers': new FormControl({ value: '', disabled: true }),
      'noUsua': new FormControl({ value: '', disabled: this.editable }, Validators.required),
      'noPerf': new FormControl({ value: '', disabled: this.editable }, Validators.required),
      'tiDocu': new FormControl('', Validators.required),
      'nuDocu': new FormControl('', Validators.required),
      'noPers': new FormControl('', Validators.required),
      'apPate': new FormControl('', Validators.required),
      'apMate': new FormControl('', Validators.required),
      'sexo': new FormControl('', Validators.required),
      'feNaci': new FormControl('', Validators.required),
      'email': new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
      ]),
      'rutaImagen': new FormControl('')

    });

  }


  cargaForma() {

    this.forma.setValue(this.usuarioModel);

    this.forma.controls['nuDocu'].setValidators([
      this.validatorNroDoc.bind(this.forma)
    ]);

  }

  validatorNroDoc(control: FormControl): { [s: string]: boolean } {

    let forma: any = this;


    if (forma.controls['tiDocu'].value === '001') {

      if (isNaN(control.value) || control.value.length !== 8) {

        return {

          validatorNroDoc: true

        };
      }

    } else if (forma.controls['tiDocu'].value === '002') {

      if (control.value.length > 12) {

        return {

          validatorNroDoc: true

        };
      }
    }

    return null;

  }


  guardarDatos() {

    // console.log(this.forma);

    this.cargando = true;

    this.usuarioModel = this.forma.getRawValue();

    this.usuarioService.updateUsuario(this.usuarioModel, this.token, this.urls)
      .subscribe(
        res => {

          this.cargando = false;
          this.router.navigateByUrl(`/welcome/perfil/${this.noUsua}`);

        },
        err => {

          this.error = err.body.error;
          this.cargando = false;

        }
      );
  }

}
