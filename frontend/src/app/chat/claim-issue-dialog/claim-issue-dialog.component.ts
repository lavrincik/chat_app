import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-claim-issue-dialog',
  templateUrl: './claim-issue-dialog.component.html',
  styleUrls: ['./claim-issue-dialog.component.scss']
})
export class ClaimIssueDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ClaimIssueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public chatId: number,
    private chatService: ChatService
  ) { }

  onCancel() {
    this.dialogRef.close();
  }

  onOk() {
    this.chatService.claimIssue(this.chatId);
    this.dialogRef.close();
  }
}
