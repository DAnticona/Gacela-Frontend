import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { UsuarioService } from '../../servicios/usuario.service';
import { Usuario } from 'src/app/clases/usuario';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  usuarioActual: Usuario;

  @Output() notify: EventEmitter<string> = new EventEmitter<string>();

  constructor(private usuarioService: UsuarioService) { 
    this.usuarioActual = this.usuarioService.getUsuario()
   }

  ngOnInit() {
    
  }

  logOut(){
    console.log("logOut");
  }

  menu() {
    this.notify.emit();
  }

}
