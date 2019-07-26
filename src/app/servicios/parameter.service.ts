import { Injectable } from '@angular/core';

import { Config } from './../interfaces/config';
import { Usuario } from '../clases/usuario';
import { Token } from '../clases/token';

@Injectable({
  providedIn: 'root'
})
export class ParameterService {

  config: Config
  usuario: Usuario;
  token: Token;

  constructor() { }

  getUsuario(): Usuario{

    return this.usuario;

  }

  setUsuario(usuario: Usuario): void {

    this.usuario = usuario;

  }

  getToken(): Token{

    return this.token;

  }

  setToken(token: Token): void {

    this.token = token;

  }

  getConfig(): Config{

    return this.config;
    
  }

  setConfig(config: Config): void {

    this.config = config;

  }

}
