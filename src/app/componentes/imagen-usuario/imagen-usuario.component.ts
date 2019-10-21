import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { ParamsService } from 'src/app/servicios/params.service';
import { UsuarioModel } from '../../models/usuario.model';

@Component({
  selector: 'app-imagen-usuario',
  templateUrl: './imagen-usuario.component.html',
  styleUrls: ['./imagen-usuario.component.css']
})
export class ImagenUsuarioComponent implements OnInit {

  usuario: UsuarioModel;

  constructor(private usuarioService: UsuarioService,
              private paramsService: ParamsService) {

    this.usuarioService.getUsuario(this.paramsService.conexion.noUsua,
                                  this.paramsService.conexion.token,
                                  this.paramsService.urls)
      .subscribe((res:any) => {

        this.usuario = res.body.usuario

      });
  }

  ngOnInit() {
  }

  onChangeFile(fileInput: any) {

    let file = fileInput.files.item(0);

    if (file) {

      this.usuarioService.cargarImagen(file, this.usuario, this.paramsService.conexion.token, this.paramsService.urls)
        .subscribe(res => {
          
          this.usuarioService.getUsuario(this.usuario.noUsua, this.paramsService.conexion.token, this.paramsService.urls)
            .subscribe((res: any) => {
              console.log(res);
              this.usuario.rutaImagen = res.body.usuario.rutaImagen
              // window.location.reload()
            });
        })

    }

  }

}
