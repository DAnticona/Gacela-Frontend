import { Component, OnInit } from '@angular/core';

import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css'],
  animations: [
    trigger('sideBarTr', [
      state('open', style({
        visibility: 'visible',
        width: '25%'
      })),
      state('closed', style({
        visibility: 'hidden'
      })),
      transition('open <=> closed', [
        animate(100)
      ])
    ]),
    trigger('contentTr', [
      state('open', style({
        marginLeft: '25%'
      })),
      state('closed', style({
        marginLeft: '0%'
      })),
      transition('open <=> closed', [
        animate(100)
      ])
    ])
  ]
})
export class WelcomePageComponent {

  isOpen = true;

  constructor() {
    console.log('WelcomePage');
  }

  onNotify() {
    this.isOpen = !this.isOpen;
  }

}
