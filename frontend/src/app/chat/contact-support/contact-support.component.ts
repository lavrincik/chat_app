import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Chat } from '../types/chat';
import { ChatType } from '../types/chatType';
import { ContactSupportDialogComponent } from '../contact-support-dialog/contact-support-dialog.component';

@Component({
  selector: 'app-contact-support',
  templateUrl: './contact-support.component.html',
  styleUrls: ['./contact-support.component.scss']
})
export class ContactSupportComponent implements OnInit, DoCheck {
  @Input() chats: Chat[];
  @Input() appContexts: string[];
  unusedContexts: string[];

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void { }

  ngDoCheck() {
    this.unusedContexts = [...this.appContexts];

    for (const chat of this.chats) {
      const index = this.unusedContexts.findIndex((_context: string) => {
        return _context === chat.appContext;
      });

      if (index != -1 && chat.type !== ChatType.closed) {
        this.unusedContexts.splice(index, 1);
      }
    }
  }

  openContextDialog() {
    this.dialog.open(ContactSupportDialogComponent, {
      data: this.unusedContexts
    });
  }
}
