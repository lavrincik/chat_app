import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../chat.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Chat } from '../types/chat';
import { MessageState } from '../types/messageState';
import { fromEvent } from 'rxjs';
import { filter, throttleTime } from 'rxjs/operators';
import { IMessageState } from '../types/iMessageState';
import { ChatType } from '../types/chatType';
import { Role } from '../types/role';
import { MatDialog } from '@angular/material/dialog';
import { ClaimIssueDialogComponent } from '../claim-issue-dialog/claim-issue-dialog.component';

@Component({
  selector: 'app-open-window-footer',
  templateUrl: './open-window-footer.component.html',
  styleUrls: ['./open-window-footer.component.scss']
})
export class OpenWindowFooterComponent implements OnInit {
  @ViewChild('textarea') textarea: ElementRef;
  @Input() chat: Chat;
  textareaValue: string;

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private chatService: ChatService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.iconRegistry.addSvgIcon(
      'send',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/send-24px.svg')
    );
  }

  ngAfterViewInit() {
    if (!this.isIssue()) {
      fromEvent(this.textarea.nativeElement, 'keydown')
      .pipe(
        filter(Boolean),
        throttleTime(1500)
      ).subscribe(() => {
        this.messagesSeen();
      });
    }
  }

   sendMessage(message: string) {
    if (message !== '') {
      this.chatService.sendMessage(message, this.chat.id);
      this.textareaValue = '';
    }
  }

  messagesSeen() {
    for (const message of this.chat.messages) {
      if (!message.states  || message.user.id == this.chatService.user.id) {
        continue;
      }

      const messageState: MessageState | undefined = message.states.find((_messageState: MessageState) => {
        return _messageState.userId == this.chatService.user.id;
      });

      if (messageState.state !== IMessageState.seen) {
        this.chatService.setMessageState(message.id, IMessageState.seen);
      }
    }
  }

  isIssue() {
    return this.chatService.user.role === Role.employee && this.chat.type === ChatType.unassigned;
  }

  openClaimIssueDialog() {
    this.dialog.open(ClaimIssueDialogComponent, {
      data: this.chat.id
    });
  }

  isChatTypeClosed() {
    return this.chat.type === ChatType.closed;
  }
}
