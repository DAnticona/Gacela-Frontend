import { Component } from '@angular/core';
import { ParamsService } from '../../servicios/params.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {

  usuario: any;
  menus: any[] = [];

  constructor(private paramsServcice: ParamsService) {

    this.usuario = this.paramsServcice.usuario;
    this.paramsServcice.menus.sort(
      (a, b) => a.nrOrde - b.nrOrde
    );



    this.menus = this.paramsServcice.menus
  }

  clickMenu(i : number) {

    this.menus.forEach((menu, index) => {

      if(index != i) {

        menu.expanded = false;

      } else {

        menu.expanded = !menu.expanded;

      }
    });
  
  }

  clickSubMenu(i: number) {

    this.menus.forEach((menu, index) => {

      if(index != i) {

        menu.activo = false;

      } else {

        menu.activo = true;

      }
    });
    
  }

}
