import { Injectable } from '@angular/core';
import { Usuario } from '../clases/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;

  constructor() { }

  getUsuario(){
    return this.usuario;
  }

  setUsuario(usuario: Usuario){
    this.usuario = usuario
  }
}
