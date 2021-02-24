import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenWindowHeadComponent } from './open-window-head.component';

describe('OpenWindowHeadComponent', () => {
  let component: OpenWindowHeadComponent;
  let fixture: ComponentFixture<OpenWindowHeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenWindowHeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenWindowHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
