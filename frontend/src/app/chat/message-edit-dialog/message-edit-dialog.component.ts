import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChatService } from '../chat.service';

interface DialogData {
  messageText: string;
  messageId: number;
}

@Component({
  selector: 'app-message-edit-dialog',
  templateUrl: './message-edit-dialog.component.html',
  styleUrls: ['./message-edit-dialog.component.scss']
})
export class MessageEditDialogComponent implements OnInit{
  public input: string;

  constructor(
    public dialogRef: MatDialogRef<MessageEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.input = this.data.messageText;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onOk() {
    this.chatService.editMessage(this.data.messageId, this.input);
    this.dialogRef.close();
  }
}
