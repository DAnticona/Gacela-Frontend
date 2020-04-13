import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServicioService } from '../../../../../servicios/servicio.service';
import { ParamsService } from '../../../../../servicios/params.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Nave } from 'src/app/models/nave.model';
import { Router, ActivatedRoute } from '@angular/router';
import { NavesService } from 'src/app/servicios/naves.service';
import { LineasService } from 'src/app/servicios/lineas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-registrar-naves',
  templateUrl: './dialog-registrar-naves.component.html',
  styleUrls: ['./dialog-registrar-naves.component.css']
})
export class DialogRegistrarNavesComponent {

  forma: FormGroup;
  naves: any[] = [];
  servicios: any[] = [];
  lineas: any[] = [];
  nave = new Nave();

  cargando = false;

  token: string;
  urls: any;
  codigo: string;
  usuario: string;

  constructor(public dialogRef: MatDialogRef<DialogRegistrarNavesComponent>,
              private servicioService: ServicioService,
              private paramsService: ParamsService,
              private navesService: NavesService,
              private lineasService: LineasService,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    this.token = this.paramsService.conexion.token;
    this.urls = this.paramsService.urls;
            
    this.forma = new FormGroup({
            
      'coNave': new FormControl({value: null, disabled: true}),
      'alNave': new FormControl(data.alNave, [Validators.required, this.existeNave.bind(this)] ),
      'noNave': new FormControl(null, Validators.required),
      'coServ': new FormControl('', Validators.required),
      'coLine': new FormControl('', Validators.required),
      'fgActi': new FormControl('S'),
      'usCrea': new FormControl(this.usuario),
      'usModi': new FormControl(this.usuario),
      'feCrea': new FormControl(new Date()),
      'feModi': new FormControl(new Date())
            
    });

    this.servicioService.getServicios(this.token, this.urls)
    .subscribe((res1: any) => {

      this.servicios = res1.body.servicios;

      this.lineasService.getLineas(this.token, this.urls)
      .subscribe((res2: any) => {

        this.lineas = res2.body.lineas;

        this.obtieneNaves();


       });

    });

  }


  obtieneNaves() {

    this.navesService.obtieneNaves(this.token, this.urls)
    .subscribe((res: any) => {

      this.naves = res.body.naves;

      // console.log(this.naves);

      // this.nave = this.naves.filter(n => n.coNave === codigo)[0];

      /*
      if(this.nave.fgActi === 'N') {

        this.nave.fgActi = '';
      } else {
        this.nave.fgActi = 'S';
      }
      */

      // this.forma.setValue(this.nave);
      // this.forma.controls.alNave.disable();


    });

  }

  existeNave(control: FormControl): {[s: string]: boolean} {

    let nroNaves = this.naves.filter(n => n.alNave === control.value.toUpperCase()).length;

    if(nroNaves > 0) {

      return {

        existeNave: true

      };

    }

    return null;

  }

  guardar() {

    this.cargando = true;
    
    this.nave = this.forma.getRawValue();
    this.nave.feCrea = null;
    this.nave.feModi = null;

    if(!this.nave.fgActi) {

      this.nave.fgActi = 'N';

    } else {

      this.nave.fgActi = 'S';

    }

    this.navesService.registraNave(this.token, this.urls, this.nave)
      .subscribe((res: any) => {
        this.codigo = res.body.nave.coNave;

        Swal.fire({
          icon: 'success',
          title: 'Datos Guardados',
          text: 'Código de Nave: ' + this.codigo,
          showConfirmButton: false,
          timer: 2000,
          onClose: () => {
            this.cargando = false;
            // this.obtieneNaves(this.codigo);
            // console.log(this.codigo);
            this.dialogRef.close();
          }
        });
      },
      (err: any) => {

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error.error.mensaje,
          footer: 'Comuníquese con el administrador del sistema',
          onClose: () => {
            this.cargando = false;
          }
        });
      }
    );
  }

  cancelar() {

    this.dialogRef.close();

  }

}
