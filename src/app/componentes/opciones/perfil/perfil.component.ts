import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParamsService } from '../../../servicios/params.service';
import { UsuarioModel } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {

  usuario: UsuarioModel;
  tidocs: any = {};
  perfil: any[] = [];
  tidoc: any;

  noUsua: string;
  token: string;
  urls: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private paramsService: ParamsService,
              private usuarioService: UsuarioService) {

    this.noUsua = this.route.snapshot.paramMap.get('noUsua');
    this.token = this.paramsService.conexion.token;
    this.urls = this.paramsService.urls;

    this.usuarioService.getUsuario(this.noUsua, this.token, this.urls)
      .subscribe((res: any) => {

        // console.log(res);
        let fechaStr = res.body.usuario.feNaci + 'T00:00:00';
        this.usuario = res.body.usuario;
        this.usuario.feNaci = new Date(fechaStr);
        // console.log(this.usuario);

        this.tidocs = res.body.tidocs;
        // console.log(this.tidocs);

        this.tidoc = this.tidocs.filter((tidoc: any) => tidoc.coTiDocu === this.usuario.tiDocu)[0];

        // console.log(this.tidoc);

      });
  }

  editarPerfil() {

    this.usuarioService.guardarUsuario(this.usuario);

    this.router.navigate(['/welcome/usuario', this.noUsua]);
    
  }



}
