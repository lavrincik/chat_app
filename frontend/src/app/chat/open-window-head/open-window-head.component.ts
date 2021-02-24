import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { NameService } from '../name.service';
import { Chat } from '../types/chat';
import { ChatService } from '../chat.service';
import { ChatType } from '../types/chatType';
import { Role } from '../types/role';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { FindMessageChats } from '../types/findMessageChats';
import { CloseIssueDialogComponent } from '../close-issue-dialog/close-issue-dialog.component';

@Component({
  selector: 'app-open-window-head',
  templateUrl: './open-window-head.component.html',
  styleUrls: ['./open-window-head.component.scss']
})
export class OpenWindowHeadComponent implements OnInit {
  @Input() chat: Chat;
  @ViewChild('settingsIcon') settingsIcon: MatMenuTrigger;
  public findOpen = false;
  public arrowDownValid = false;
  public greyColor = '#808080';
  public blackColor = '#000000';
  
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private chatService: ChatService,
    private nameService: NameService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.iconRegistry.addSvgIcon(
      'clear',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/baseline-clear-24px.svg')
    );
    this.iconRegistry.addSvgIcon(
      'settings',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/settings-24px.svg')
    );
    this.iconRegistry.addSvgIcon(
      'arrow-down',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/arrow_down-18dp.svg')
    );
    this.iconRegistry.addSvgIcon(
      'arrow-up',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/arrow_up-18dp.svg')
    );

    this.chatService.findMessage$.subscribe((findMessages: FindMessageChats) => {
      const findMessage = findMessages[this.chat.id];
      if (findMessage 
        && (findMessage.firstMessageId != findMessage.currentMessageId || findMessage.lastMessageId)) {
          this.arrowDownValid = true;
      } else {
        this.arrowDownValid = false;
      }
    })
  }

  getChatName() {
    return this.nameService.getChatName(this.chat);
  }

  toggleChat() {
    this.chatService.toggleColapsedWindow(this.chat.id);
  }

  closeChat(event: MouseEvent) {
    event.stopPropagation();
    this.chatService.closeWindow(this.chat.id);
  }

  showContext() {
    return (this.chat.type === ChatType.open || this.chat.type === ChatType.unassigned) 
      && this.chatService.user.role === Role.employee;
  }

  settings(event: MouseEvent) {
    event.stopPropagation();
    this.settingsIcon.openMenu;
  }

  isEmployeeAndIssue() {
    return (this.chat.type === ChatType.open || this.chat.type === ChatType.unassigned) 
      && this.chatService.user.role === Role.employee;
  }

  isChatTypeOpen() {
    return this.chat.type === ChatType.open;
  }

  openCloseIssueDialog() {
    this.dialog.open(CloseIssueDialogComponent, {
      data: this.chat.id
    });
  }

  openFind() {
    this.findOpen = true;
  }

  closeFind() {
    this.chatService.findStop(this.chat.id);
    this.findOpen = false;
  }

  findNext(pattern: string) {
    this.chatService.findNextMessage(this.chat.id, pattern, 'next');
  }

  findPrevious(pattern: string) {
    this.chatService.findNextMessage(this.chat.id, pattern, 'previous');
  }
}
