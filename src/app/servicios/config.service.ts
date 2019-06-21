import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Config } from '../interfaces/config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  configUrl = '../assets/config.json';

  constructor(private http: HttpClient) { }

  getConfig() {
    return this.http.get<Config>(this.configUrl);
  }
}
