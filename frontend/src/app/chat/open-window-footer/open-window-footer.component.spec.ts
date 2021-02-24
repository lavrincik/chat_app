import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenWindowFooterComponent } from './open-window-footer.component';

describe('OpenWindowFooterComponent', () => {
  let component: OpenWindowFooterComponent;
  let fixture: ComponentFixture<OpenWindowFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenWindowFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenWindowFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
