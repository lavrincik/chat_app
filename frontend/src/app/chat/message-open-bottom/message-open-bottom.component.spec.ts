import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageOpenBottom } from './message-open-bottom.component';

describe('MessageOnOpenComponent', () => {
  let component: MessageOpenBottom;
  let fixture: ComponentFixture<MessageOpenBottom>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageOpenBottom ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageOpenBottom);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
