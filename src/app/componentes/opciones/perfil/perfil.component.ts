import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParamsService } from '../../../servicios/params.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  forma: FormGroup;
  
  usuario: any = {
    feNaci: new Date()
  };
  perfil: any = {};

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
        this.usuario = res.body.usuario;
        this.usuario.feNaci = new Date(res.body.usuario.feNaci.year, (res.body.usuario.feNaci.monthValue - 1), res.body.usuario.feNaci.dayOfMonth);
        // console.log(this.usuario);

      });
  }

  ngOnInit() {
  }

  editarPerfil() {

    this.usuarioService.guardarUsuario(this.usuario);

    this.router.navigate(['/welcome/usuario', this.noUsua]);
    
  }



}
