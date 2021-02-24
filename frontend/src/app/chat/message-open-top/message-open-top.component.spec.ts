import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageOpenTopComponent } from './message-open-top.component';

describe('MessageOpenTopComponent', () => {
  let component: MessageOpenTopComponent;
  let fixture: ComponentFixture<MessageOpenTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageOpenTopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageOpenTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
