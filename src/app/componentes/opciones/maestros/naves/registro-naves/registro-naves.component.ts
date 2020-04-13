import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServicioService } from '../../../../../servicios/servicio.service';
import { ParamsService } from 'src/app/servicios/params.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavesService } from '../../../../../servicios/naves.service';
import { Nave } from '../../../../../models/nave.model';
import { LineasService } from '../../../../../servicios/lineas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-naves',
  templateUrl: './registro-naves.component.html',
  styleUrls: ['./registro-naves.component.css']
})
export class RegistroNavesComponent {

  forma: FormGroup;
  naves: any[] = [];
  servicios: any[] = [];
  lineas: any[] = [];
  nave = new Nave();

  // VARIABLES DE AUDITORÍA
  usCrea: string;
  usModi: string;
  feCrea: Date;
  feModi: Date;

  cargando = false;

  token: string;
  urls: any;
  codigo: string;
  usuario: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private servicioService: ServicioService,
              private paramsService: ParamsService,
              private navesService: NavesService,
              private lineasService: LineasService) {

    this.token = this.paramsService.conexion.token;
    this.urls = this.paramsService.urls;

    this.usuario = this.route.snapshot.paramMap.get('noUsua');
    this.codigo = this.route.snapshot.paramMap.get('coNave');

    this.forma = new FormGroup({

      'coNave': new FormControl({value: null, disabled: true}),
      'alNave': new FormControl(null, [Validators.required, this.existeNave.bind(this)] ),
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

          this.obtieneNaves(this.codigo);


         });

      });
  
  }

  obtieneNaves(codigo: string) {

    this.navesService.obtieneNaves(this.token, this.urls)
    .subscribe((res: any) => {

      this.naves = res.body.naves;

      if(codigo !== 'nuevo') {

        this.nave = this.naves.filter(n => n.coNave === codigo)[0];

        if(this.nave.fgActi === 'N') {

          this.nave.fgActi = '';
        } else {
          this.nave.fgActi = 'S';
        }

        this.usCrea = this.nave.usCrea;
        this.usModi = this.nave.usModi;
        this.feCrea = new Date(this.nave.feCrea);
        this.feModi = new Date(this.nave.feModi);

        this.forma.setValue(this.nave);
        this.forma.controls.alNave.disable();
  
      } else {

        this.usCrea = this.usuario;
        this.usModi = this.usuario;
        this.feCrea = new Date();
        this.feModi = new Date();

      }

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
            this.obtieneNaves(this.codigo);
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



  volver() {

    this.router.navigate(['../'], { relativeTo: this.route });

  }

}
