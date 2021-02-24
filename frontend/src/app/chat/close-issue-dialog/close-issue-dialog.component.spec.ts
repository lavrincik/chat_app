import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseIssueDialogComponent } from './close-issue-dialog.component';

describe('CloseIssueDialogComponent', () => {
  let component: CloseIssueDialogComponent;
  let fixture: ComponentFixture<CloseIssueDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseIssueDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseIssueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
