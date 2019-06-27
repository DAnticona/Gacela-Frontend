import { Component, OnInit } from '@angular/core';

import { UsuarioService } from '../../servicios/usuario.service';
import { Usuario } from 'src/app/clases/usuario';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  usuarioActual: Usuario;

  constructor(private usuarioService: UsuarioService) { 
    this.usuarioActual = this.usuarioService.getUsuario()
   }

  ngOnInit() {
    
  }

  logOut(){
    console.log(this.usuarioActual);
  }

  menu(){
    console.log("click Menu");
  }

}
