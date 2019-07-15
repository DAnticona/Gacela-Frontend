import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';

import { UsuarioService } from '../../servicios/usuario.service';
import { Usuario } from '../../clases/usuario';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  @ViewChild('menuLogistica', { static: false }) menuLogistica: ElementRef;
  @ViewChild('menuOperaciones', { static: false }) menuOperaciones: ElementRef;
  @ViewChild('menuEquipos', { static: false }) menuEquipos: ElementRef;
  @ViewChild('menuFinanzas', { static: false }) menuFinanzas: ElementRef;

  usuarioActual: Usuario;

  constructor(private usuarioService: UsuarioService, private renderer: Renderer2, private el: ElementRef) {
    this.usuarioActual = this.usuarioService.getUsuario();
    console.log(this.usuarioActual.menus)
  }

  ngOnInit() {
    
  }

  activaHome(){
    //this.clearStyle();
  }

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

}
