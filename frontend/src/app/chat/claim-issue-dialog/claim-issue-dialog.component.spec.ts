import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimIssueDialogComponent } from './claim-issue-dialog.component';

describe('ClaimIssueDialogComponent', () => {
  let component: ClaimIssueDialogComponent;
  let fixture: ComponentFixture<ClaimIssueDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimIssueDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimIssueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
