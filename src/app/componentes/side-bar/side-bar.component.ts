import { Component } from '@angular/core';
import { ParamsService } from '../../servicios/params.service';
import { MenuService } from '../../servicios/menu.service';
import { PerfilService } from '../../servicios/perfil.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {

  noUsua: string;
  coPerf: string;
  menus: any[] = [];

  constructor(private paramsServcice: ParamsService,
              private perfilService: PerfilService,
              private menuService: MenuService) {

    this.noUsua = this.paramsServcice.conexion.noUsua;

    this.perfilService.getPerfil(this.noUsua, this.paramsServcice.conexion.token, this.paramsServcice.urls)
      .subscribe((res: any) => {
        // console.log(res);
        this.coPerf = res.body.perfil.coPerf;

        this.menuService.getMenusXPerfil(this.coPerf,
                                          this.paramsServcice.conexion.token,
                                          this.paramsServcice.urls)
          .subscribe((res1: any) => {
            this.menus = res1.body.menus;
          })
      })

    // this.paramsServcice.menus.sort(
    //   (a, b) => a.nrOrde - b.nrOrde
    // );



    // this.menus = this.paramsServcice.menus

    this.menus.sort(
         (a, b) => a.nrOrde - b.nrOrde
       );

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
