import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Message } from '../types/message';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ChatService } from '../chat.service';
import { MessageState } from '../types/messageState';
import { UserSeen } from '../open-window/open-window.component';
import { IMessageState } from '../types/iMessageState';
import { trigger, transition, animate, style } from '@angular/animations';
import { Flag } from '../types/messageFlag';
import { MatDialog } from '@angular/material/dialog';
import { MessageDeleteDialogComponent } from '../message-delete-dialog/message-delete-dialog.component';
import { MessageEditDialogComponent } from '../message-edit-dialog/message-edit-dialog.component';
import { ChatType } from '../types/chatType';
import { Role } from '../types/role';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  animations: [
    trigger('openMessage', [
      transition(':leave', [
        animate('0.2s ease-in', style({
          opacity: 0
        }))
      ]),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.2s ease-out', style({
          opacity: 1
        }))
      ]),
    ])
  ]
})
export class MessageComponent implements OnInit {
  @Input() message: Message;
  @Input() usersSeen: UserSeen[];
  @Input() messageIndex: number;
  @Input() searchPattern?: string;
  @Output() addUserSeen = new EventEmitter<UserSeen>();
  @Input() chatType: ChatType;
  public moreOpen = false;

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private chatService: ChatService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.iconRegistry.addSvgIcon(
      'check-filled',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/check_circle-filled-24dp.svg')
    );
    this.iconRegistry.addSvgIcon(
      'check-outlined',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/check_circle-outlined-24dp.svg')
    );
    this.iconRegistry.addSvgIcon(
      'visibility',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/visibility-24dp.svg')
    );
    this.iconRegistry.addSvgIcon(
      'edit',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/edit-18dp.svg')
    );
    this.iconRegistry.addSvgIcon(
      'more',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/more_horiz-24dp.svg')
    );
  }

  isUser() {
    return this.chatService.user.id == this.message.user.id;
  }

  onMessageClick() {
    this.message.open = !this.message.open;
  }

  messageState() {
    if (this.chatType === ChatType.unassigned && this.chatService.user.role === Role.client) {
      if (!this.message.sent) {
        return 'sending';
      }
      return 'sent';
    }

    if (!this.message.sent) {
      return 'sending';
    }

    let { seen, someSeen } = this.messageStateSeen();
    if (seen) {
      return 'seen';
    }
  
    if (this.message.user.id != this.chatService.user.id || someSeen) {
      return 'none';
    }

    if (this.message.states.some((state: MessageState) => { 
      return state.state === IMessageState.delivered && state.userId != this.chatService.user.id;
    })) {
      return 'delivered';
    }
    
    if (this.message.sent) {
      return 'sent';
    }

    return 'none';
  }

  private messageStateSeen() {
    let seen = false;
    let someSeen = false;
    for (const state of this.message.states) {
      if (state.userId == this.chatService.user.id || state.state !== IMessageState.seen) {
        continue;
      }

      const userSeen = this.usersSeen.find((_userSeen) => {
        return _userSeen.userId == state.userId;
      });

      if (!userSeen) {
        this.addUserSeen.emit({
          userId: state.userId,
          messageIndex: this.messageIndex
        });
        seen = true;
      }

      if (!userSeen.messageIndex || userSeen.messageIndex < this.messageIndex) {
        userSeen.messageIndex = this.messageIndex;
        seen = true;
      }  
      
      if (userSeen.messageIndex == this.messageIndex) {
        seen = true;
      }

      someSeen = true;
    }
    return { seen, someSeen }; 
  }

  public toogleMore() {
    this.moreOpen = !this.moreOpen;
  }

  public editMessage() {
    this.dialog.open(MessageEditDialogComponent, {
      data: {
        messageText: this.message.text,
        messageId: this.message.id
      }
    });
  }

  public deleteMessage() {
    this.dialog.open(MessageDeleteDialogComponent, {
      data: this.message.id
    });
  }

  public messageText() {
    return this.message.flag === Flag.edited ? this.message.editedText : this.message.text;
  }

  public messageDeleted() {
    return this.message.flag === Flag.deleted;
  }
}
