import { Component, OnInit, Input, ViewChild, ElementRef, HostListener, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { ChatService } from '../chat.service';
import { Chat } from '../types/chat';
import { MessageState } from '../types/messageState';
import { Subject, of } from 'rxjs';
import { filter, debounceTime, switchMap } from 'rxjs/operators';
import { User } from '../types/user';
import { IMessageState } from '../types/iMessageState';
import { ChatType } from '../types/chatType';
import { FindMessageChats } from '../types/findMessageChats';

export type UserSeen = {
  userId: number;
  messageIndex?: number;
}

@Component({
  selector: 'app-open-window',
  templateUrl: './open-window.component.html',
  styleUrls: ['./open-window.component.scss'],
})

export class OpenWindowComponent implements OnInit, AfterViewChecked {
  @Input() chat: Chat;
  @ViewChild('messages') messagesDiv: ElementRef;
  public windowOnTop = false;
  public spinner = false;
  private windowHeight = 0;
  private oldFirstMessageId: number;
  private oldLastMessage: number;
  private scrollToBottom = true;
  public mouseover$ = new Subject<boolean>();
  private usersSeen: UserSeen[];
  private toScrollInto?: number;
  public searchPattern?: string;

  constructor(
    private chatService: ChatService,
    private cdRef: ChangeDetectorRef
  ) { 
    this.messagesSeen();
  }

  ngOnInit() {
    this.usersSeen = this.chat.users.map((user: User) => {
      return {
        userId: user.id
      }
    });

    this.chatService.findMessage$.subscribe((findMessages: FindMessageChats) => {
      const findMessage = findMessages[this.chat.id];
      if (findMessage) {
        this.toScrollInto = findMessage.currentMessageId;
        this.searchPattern = findMessage.pattern; 
      } else {
        this.toScrollInto = undefined;
        this.searchPattern = undefined;
      }
    });
  }

  ngAfterViewChecked() {
    if (this.toScrollInto) {
      const el = document.getElementById("message-" + this.toScrollInto);
      el.scrollIntoView({ behavior: "smooth" });
    }

    this.spinner = this.windowOnTop && !this.chat.allMessagesReceived;

    if (this.scrollToBottom 
      && this.chat.messages[this.chat.messages.length - 1]
      && this.oldLastMessage != this.chat.messages[this.chat.messages.length - 1].id) {
      if (this.messagesDiv) {
        this.messagesDiv.nativeElement.scrollTop = this.messagesDiv.nativeElement.scrollHeight;
        this.oldLastMessage = this.chat.messages[this.chat.messages.length - 1].id;
      }
    }

    if (this.chat.messages.length != 0 
      && this.oldFirstMessageId != this.chat.messages[0].id
      && this.chat.messages[0].found === undefined) {
      this.messagesDiv.nativeElement.scrollTop = this.messagesDiv.nativeElement.scrollHeight - this.windowHeight;
      this.oldFirstMessageId = this.chat.messages[0].id;
    }
    
    this.toScrollInto = undefined;
    this.cdRef.detectChanges();
  }

  @HostListener('scroll', ['$event'])
  onScroll(event) {
    this.scrollToBottom = 
      this.messagesDiv.nativeElement.scrollTop >= 
      (this.messagesDiv.nativeElement.scrollHeight - this.messagesDiv.nativeElement.offsetHeight)
      ? true : false;

    if(this.toScrollInto) {
      this.scrollToBottom = false;
    }

    if (this.messagesDiv.nativeElement.scrollTop == 0 && !this.chat.allMessagesReceived) {
      this.windowOnTop = true;
      this.windowHeight = this.messagesDiv.nativeElement.scrollHeight;
      this.chatService.getMessages(this.chat.id);
    } else {
      this.windowOnTop = false;
    }
  }

  messagesSeen() {
    this.mouseover$.pipe(
      filter(Boolean),
      debounceTime(400)
    ).subscribe(() => {
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
    });
  }

  onMouseover() {
    this.mouseover$.next(true);
  }

  onAddUserSeen(userSeen: UserSeen) {
    const _userSeen = this.usersSeen.find((value: UserSeen) => {
      return value.userId == userSeen.userId;
    });

    if (_userSeen) {
      _userSeen.messageIndex = userSeen.messageIndex;
    } else {
      this.usersSeen.push(userSeen);
    }
  }

  isChatTypeClosed() {
    return this.chat.type === ChatType.closed;
  }
}
