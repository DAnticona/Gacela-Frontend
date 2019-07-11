import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Rep6040Component } from './rep6040.component';

describe('Rep6040Component', () => {
  let component: Rep6040Component;
  let fixture: ComponentFixture<Rep6040Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Rep6040Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Rep6040Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
