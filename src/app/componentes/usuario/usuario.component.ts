import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { ParamsService } from '../../servicios/params.service';
import { ActivatedRoute } from '@angular/router';
import { UsuarioModel } from '../../models/usuario.model';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  forma: FormGroup;
  usuarioModel = new UsuarioModel();

  usuario: any;
  tiDocus: any[];

  token: string;
  noUsua: string;
  urls: any;

  constructor(private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private paramsService: ParamsService) {

    this.noUsua = this.route.snapshot.paramMap.get('noUsua');
    this.token = this.paramsService.conexion.token;
    this.urls = this.paramsService.urls;

    this.usuarioService.getUsuario(this.noUsua, this.token, this.urls)
      .subscribe((res: any) => {

        // console.log(res);

        this.usuario = res.body.usuario;
        this.usuario.feNaci = new Date(res.body.usuario.feNaci.year, (res.body.usuario.feNaci.monthValue - 1), res.body.usuario.feNaci.dayOfMonth);

        this.tiDocus = res.body.tidocs;

        this.usuarioModel = this.usuario;

        // console.log('UsuarioModel:', this.usuarioModel);
        // console.log(this.tiDocus);

        this.cargaForma();

      });


    this.forma = new FormGroup({

      'coPers': new FormControl({ value: '', disabled: true }, Validators.required),
      'tiDocu': new FormControl('', Validators.required),
      'nuDocu': new FormControl('', Validators.required),
      'noPers': new FormControl('', Validators.required),
      'apPate': new FormControl('', Validators.required),
      'apMate': new FormControl('', Validators.required),
      'sexo': new FormControl('', Validators.required),
      'feNaci': new FormControl('', Validators.required),
      'email': new FormControl('', Validators.required),
      'rutaImagen': new FormControl(''),
      'noUsua': new FormControl({ value: '', disabled: true }),
      'noPerf': new FormControl({ value: '', disabled: true })

    });



  }

  ngOnInit() {
  }


  cargaForma() {


    this.forma.setValue(this.usuarioModel);
    // this.forma.controls.

  }


  guardarDatos() {

    // console.log(this.forma);
    // console.log(this.forma.getRawValue());
    // console.log(this.usuarioModel);
    this.usuarioModel = this.forma.getRawValue();
    this.usuario = this.usuarioModel;
    //this.usuarioModel = this.forma.value;
    console.log(this.usuario);
    this.usuarioService.updateUsuario(this.usuario, this.token, this.urls)
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );
  }


}
