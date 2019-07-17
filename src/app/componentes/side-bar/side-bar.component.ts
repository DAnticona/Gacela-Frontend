import { Component, OnInit, Renderer2, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';

import { UsuarioService } from '../../servicios/usuario.service';
import { Usuario } from '../../clases/usuario';
import { Menu } from '../../clases/menu';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit, AfterViewInit {

  @ViewChild('menu', { static: false }) menu: ElementRef;


  usuarioActual: Usuario;

  constructor(private usuarioService: UsuarioService,
              private renderer: Renderer2,
              private padre: ElementRef,
              private route: Router,
              private activatedRoute: ActivatedRoute) {
    this.usuarioActual = this.usuarioService.getUsuario();
    this.usuarioActual.menus.sort(
      (a,b) => a.nrOrde - b.nrOrde
    );
  }

  ngOnInit() {
    
  }

  ngAfterViewInit(){
    this.agregarMenus();
  }

  @HostListener('click', ['$event.target'])
  onClick(data){

    for(var value of this.usuarioActual.menus){

      if(data.id === value.noMenu.toLowerCase() && value.lvMenu === 2){
        this.route.navigate([value.ruta], {relativeTo: this.activatedRoute});
        break;
      }
    }
    
  }

  agregarMenus(){

    for(var value of this.usuarioActual.menus){

      if(value.coPadr === '/'){

        let text = this.renderer.createText(value.alMenu);
        let a = this.renderer.createElement('a');
        let ul = this.renderer.createElement('ul');
        let li = this.renderer.createElement('li');

        this.renderer.addClass(a, 'dropdown-toggle');
        this.renderer.setProperty(a, 'id', value.noMenu.toLowerCase());
        this.renderer.setProperty(a, 'href', `#sm${value.noMenu.toLowerCase()}`);
        this.renderer.setAttribute(a, 'data-toggle', 'collapse');
        this.renderer.setAttribute(a, 'aria-expanded', 'false');

        this.renderer.addClass(ul, 'collapse');
        this.renderer.addClass(ul, 'list-unstyled');
        this.renderer.setProperty(ul, 'id', `sm${value.noMenu.toLowerCase()}`);
        
        this.renderer.appendChild(a, text);
        this.renderer.appendChild(li, a);
        this.renderer.appendChild(li, ul);
        this.renderer.appendChild(this.menu.nativeElement, li)

        this.padre.nativeElement = ul;

      } else {

        let text = this.renderer.createText(value.alMenu);
        let a = this.renderer.createElement('a');
        let li = this.renderer.createElement('li');

        this.renderer.setProperty(a, 'id', value.noMenu.toLowerCase());
        this.renderer.addClass(a, 'submenu');

        this.renderer.appendChild(a, text);
        this.renderer.appendChild(li, a);
        this.renderer.appendChild(this.padre.nativeElement, li)

      }

    }

  }

}