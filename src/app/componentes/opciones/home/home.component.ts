import { Component, OnInit } from '@angular/core';

import { UsuarioService } from '../../../servicios/usuario.service';
import { Usuario } from '../../../clases/usuario';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usuarioActual: Usuario;

  constructor(private usuarioService: UsuarioService) {
    this.usuarioActual = this.usuarioService.getUsuario();
   }

  ngOnInit() {
  }

}
