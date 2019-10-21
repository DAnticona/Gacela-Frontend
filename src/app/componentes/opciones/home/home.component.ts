import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../servicios/usuario.service';
import { ParamsService } from '../../../servicios/params.service';
import { PerfilService } from '../../../servicios/perfil.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usuario: any;
  perfil: any;

  constructor(private usuarioService: UsuarioService,
              private paramsService: ParamsService,
              private perfilService: PerfilService) {

    this.usuarioService.getUsuario(this.paramsService.conexion.noUsua,
                                    this.paramsService.conexion.token,
                                    this.paramsService.urls)
      .subscribe((res: any) => {

        this.usuario = res.body.usuario;

      });


    this.perfilService.getPerfil(this.paramsService.conexion.noUsua,
                                  this.paramsService.conexion.token,
                                  this.paramsService.urls)
      .subscribe((res1: any) => {
        
        this.perfil = res1.body.perfil;
        
      })

  }

  ngOnInit() {
  }

}
