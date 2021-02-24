import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-contact-support-dialog',
  templateUrl: './contact-support-dialog.component.html',
  styleUrls: ['./contact-support-dialog.component.scss']
})
export class ContactSupportDialogComponent {
  appContext: string;

  constructor(
    public dialogRef: MatDialogRef<ContactSupportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public unusedContexts: string[],
    private chatService: ChatService
  ) { }

  onCancel() {
    this.dialogRef.close();
  }

  onOk() {
    this.chatService.createClientChat(this.appContext)
    this.dialogRef.close();
  }
}
