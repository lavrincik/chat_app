import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-close-issue-dialog',
  templateUrl: './close-issue-dialog.component.html',
  styleUrls: ['./close-issue-dialog.component.scss']
})
export class CloseIssueDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CloseIssueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public chatId: number,
    private chatService: ChatService
  ) { }

  onCancel() {
    this.dialogRef.close();
  }

  onOk() {
    this.chatService.closeIssue(this.chatId);
    this.dialogRef.close();
  }
}
