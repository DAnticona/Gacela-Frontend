import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { LogoutService } from '../../servicios/logout.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  usuario: any;

  @Output() notify: EventEmitter<string> = new EventEmitter<string>();

  constructor(private logoutService: LogoutService,
              private router: Router) { }

  ngOnInit() {
    
  }

  logout() {

    this.logoutService.logout().subscribe(
      res => {
        // console.log(res);
        this.router.navigate(['login']);
      },
      err => {
        console.log(err);
      },
    );
  }

  menu() {
    this.notify.emit();
  }

}
