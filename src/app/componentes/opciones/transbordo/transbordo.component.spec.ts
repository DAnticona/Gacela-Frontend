import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransbordoComponent } from './transbordo.component';

describe('TransbordoComponent', () => {
  let component: TransbordoComponent;
  let fixture: ComponentFixture<TransbordoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransbordoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransbordoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
