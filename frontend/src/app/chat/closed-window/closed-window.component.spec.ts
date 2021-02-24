import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedWindowComponent } from './closed-window.component';

describe('ClosedWindowComponent', () => {
  let component: ClosedWindowComponent;
  let fixture: ComponentFixture<ClosedWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClosedWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosedWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
