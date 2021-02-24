import { Component, OnInit, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Chat } from '../types/chat';
import { ChatService } from '../chat.service';
import { NameService } from '../name.service';
import { ChatType } from '../types/chatType';
import { Role } from '../types/role';

@Component({
  selector: 'app-closed-window',
  templateUrl: './closed-window.component.html',
  styleUrls: ['./closed-window.component.scss']
})
export class ClosedWindowComponent implements OnInit {
  @Input() chat: Chat;

  constructor(
    private chatService: ChatService,          
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private nameService: NameService
  ) { }

  ngOnInit() {
    this.iconRegistry.addSvgIcon(
      'clear',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/baseline-clear-24px.svg')
    );
  }

  getChatName(chat: Chat) {
    return this.nameService.getChatName(chat);
  }

  toggleWindow() {
    this.chatService.toggleColapsedWindow(this.chat.id);
  }

  closeWindow() {
    this.chatService.closeWindow(this.chat.id);
  }

  showContext() {
    return (this.chat.type === ChatType.open || this.chat.type === ChatType.unassigned) 
      && this.chatService.user.role === Role.employee;
  }
}
