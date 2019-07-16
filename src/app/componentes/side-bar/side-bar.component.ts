import { Component, OnInit, Renderer2, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { UsuarioService } from '../../servicios/usuario.service';
import { Usuario } from '../../clases/usuario';
import { Menu } from '../../clases/menu';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit, AfterViewInit {
/*
  @ViewChild('menuLogistica', { static: false }) menuLogistica: ElementRef;
  @ViewChild('menuOperaciones', { static: false }) menuOperaciones: ElementRef;
  @ViewChild('menuEquipos', { static: false }) menuEquipos: ElementRef;
  @ViewChild('menuFinanzas', { static: false }) menuFinanzas: ElementRef;
*/

  @ViewChild('menu', { static: false }) menu: ElementRef;


  usuarioActual: Usuario;

  constructor(private usuarioService: UsuarioService, private renderer: Renderer2, private el: ElementRef) {
    this.usuarioActual = this.usuarioService.getUsuario();
    this.usuarioActual.menus.sort(
      (a,b) => a.coMenu.localeCompare(b.coMenu)
    );
  }

  ngOnInit() {
    
  }

  ngAfterViewInit(){
    this.agregarMenus();
  }

  activaHome(){
    //this.clearStyle();
  }

  agregarMenus(){

    for(var value of this.usuarioActual.menus){

      let li = this.renderer.createElement('li');
      let a = this.renderer.createElement('a');
      let text = this.renderer.createText(value.alMenu);
      
      this.renderer.appendChild(a, text);
      this.renderer.appendChild(li, a);
      this.renderer.setProperty(a, 'id', value.noMenu);

      if(value.coPadr === '/'){

        let ul = this.renderer.createElement('ul');
        this.renderer.setProperty(ul, 'id', `sm${value.noMenu.toLowerCase()}`);
        this.renderer.addClass(ul, 'collapse');
        this.renderer.addClass(ul, 'list-unstyled');

        this.renderer.setProperty(a, 'href', `#sm${value.noMenu.toLowerCase()}`);
        this.renderer.setProperty(a, 'data-toggle', 'collapse');
        this.renderer.setProperty(a, 'aria-expanded', 'false');
        this.renderer.addClass(a, 'dropdown-toggle');

        this.renderer.appendChild(li, ul);
        this.renderer.appendChild(this.menu.nativeElement, li)

      } else if(!this.esOpcion(value, this.usuarioActual.menus)) {

        

      }

    }

  }

  esOpcion(menu: Menu, menus: Menu[]): boolean{
    var esOpcion: boolean = false;
    for(var value of menus){

      if(value.coPadr === menu.coMenu){

        esOpcion = false;
        break;

      } else {

        esOpcion = true;
        break;

      }

    }

    return esOpcion;
  }

  /*
  activaOperaciones(){
    this.clearStyle();
    this.renderer.addClass(this.menuLogistica.nativeElement, 'active');
    this.renderer.addClass(this.menuOperaciones.nativeElement, 'active');
  }

  activaEquipos(){
    this.clearStyle();
    this.renderer.addClass(this.menuLogistica.nativeElement, 'active');
    this.renderer.addClass(this.menuEquipos.nativeElement, 'active');
  }

  activaFinanzas(){
    this.clearStyle();
    this.renderer.addClass(this.menuFinanzas.nativeElement, 'active');
  }

  clearStyle(){
    this.renderer.removeClass(this.menuLogistica.nativeElement, 'active');
    this.renderer.removeClass(this.menuFinanzas.nativeElement, 'active');
    this.renderer.removeClass(this.menuOperaciones.nativeElement, 'active');
    this.renderer.removeClass(this.menuEquipos.nativeElement, 'active');
  }
  */

}
