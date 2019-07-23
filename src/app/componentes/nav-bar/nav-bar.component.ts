import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { UsuarioService } from '../../servicios/usuario.service';
import { Usuario } from 'src/app/clases/usuario';
import { LogoutService } from '../../servicios/logout.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  usuarioActual: Usuario;

  @Output() notify: EventEmitter<string> = new EventEmitter<string>();

  constructor(private usuarioService: UsuarioService,
              private logoutService: LogoutService) { 
    this.usuarioActual = this.usuarioService.getUsuario()
   }

  ngOnInit() {
    
  }

  logOut(){
    console.log("logOut");
    /*
    this.logoutService.logOut(this.usuarioActual).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      },
      () => {
        console.log('router');
      }
    )
    */
  }

  menu() {
    this.notify.emit();
  }

}
