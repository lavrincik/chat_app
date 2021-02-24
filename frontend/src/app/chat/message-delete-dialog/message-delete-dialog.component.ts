import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-message-delete-dialog',
  templateUrl: './message-delete-dialog.component.html',
  styleUrls: ['./message-delete-dialog.component.scss']
})
export class MessageDeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MessageDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public messageId: number,
    private chatService: ChatService
  ) { }

  onCancel() {
    this.dialogRef.close();
  }

  onOk() {
    this.chatService.deleteMessage(this.messageId);
    this.dialogRef.close();
  }
}
