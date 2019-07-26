import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Usuario } from 'src/app/clases/usuario';

import { ParameterService } from '../../servicios/parameter.service';
import { LogoutService } from '../../servicios/logout.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  usuarioActual: Usuario;

  @Output() notify: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private parameterService: ParameterService,
    private logoutService: LogoutService) {

    this.usuarioActual = this.parameterService.getUsuario()

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
