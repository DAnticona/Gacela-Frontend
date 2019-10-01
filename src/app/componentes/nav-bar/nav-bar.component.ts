import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Router } from '@angular/router';
import { ParamsService } from '../../servicios/params.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  usuario: any;
  error: any;

  constructor(private router: Router,
              private paramsService: ParamsService) {

    this.usuario = this.paramsService.usuario;
    // console.log(this.usuario);
  }

  ngOnInit() {

  }

  logout() {

    this.paramsService.getLogout(this.usuario.noUsua)
      .subscribe(
        res => {
          // console.log(res);
          this.router.navigate(['login']);
        },
        err => {
          console.log(err);
          // this.error = err.error;
        },
      );
  }

}
