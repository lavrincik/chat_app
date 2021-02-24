import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenWindowComponent } from './open-window.component';

describe('OpenWindowComponent', () => {
  let component: OpenWindowComponent;
  let fixture: ComponentFixture<OpenWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
