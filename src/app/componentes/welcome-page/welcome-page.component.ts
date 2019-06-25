import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { UsuarioService } from '../../servicios/usuario.service';
import { Usuario } from '../../clases/usuario';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {

  usuarioActual: Usuario;

  constructor(private usuarioService: UsuarioService) { 
    this.usuarioActual = this.usuarioService.getUsuario();
  }

  ngOnInit() {
    
  }

}
