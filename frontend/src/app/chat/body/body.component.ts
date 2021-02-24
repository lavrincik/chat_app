import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../chat.service';
import { User } from '../types/user';
import { Chat } from '../types/chat';
import { ChatType } from '../types/chatType';
import { Role } from '../types/role';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NameService } from '../name.service';

type OpenHeader = {
  openIssues: boolean;
  unassigned: boolean;
  unassignedContexts: { [context: string]: boolean; }
  employees: boolean;
};

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {
  @Input() appContexts: string[];
  chats: Chat[] = undefined;
  onlineDot = '#00ff40';
  offlineDot = '#c4c4c4';
  openHeader: OpenHeader = {
    openIssues: true,
    unassigned: true,
    unassignedContexts: {},
    employees: true
  }

  constructor(
    private nameService: NameService,
    private chatService: ChatService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.chatService.chats$.subscribe(
      (chats: Chat[]) => {
        this.chats = chats;
      }
    );

    for (const context of this.appContexts) {
      this.openHeader.unassignedContexts[context] = true;
    }

    this.iconRegistry.addSvgIcon(
      'arrow-drop-down',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/arrow_drop_down-18dp.svg')
    );
    this.iconRegistry.addSvgIcon(
      'arrow-drop-up',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/arrow_drop_up-18dp.svg')
    );
  }

  isChatPrivate(users: User[]) {
    return users.length === 1;
  }

  isChatTypeOpen(chat: Chat) {
    return chat.type === ChatType.open;
  }

  isChatTypeUnassigned(chat: Chat) {
    return chat.type === ChatType.unassigned;
  }

  isChatTypeEmployee(chat: Chat) {
    return chat.type === ChatType.employee;
  }

  getChatName(chat: Chat) {
    return this.nameService.getChatName(chat);
  }

  userConnected(users: User[]) {
    return users[0].connected;
  }

  clientConnected(users: User[]) {
    for (const user of users) {
      if (user.role === Role.client) {
        return user.connected;
      }
    }
  }

  openWindow(chatId: number) {
    this.chatService.openWindow(chatId);
  }

  isUserEmployee() {
    return this.chatService.user.role === Role.employee;
  }

  isUserClient() {
    return this.chatService.user.role === Role.client;
  }

  getAppContexts() {
    return this.chatService.appContexts;
  }

  toogleOpenIssues() {
    this.openHeader.openIssues = !this.openHeader.openIssues;
  }

  toogleUnassigned() {
    this.openHeader.unassigned = !this.openHeader.unassigned;
  }

  toogleUnassignedContext(context: string) {
    this.openHeader.unassignedContexts[context] = !this.openHeader.unassignedContexts[context];
  }

  toogleEmployees() {
    this.openHeader.employees = !this.openHeader.employees;
  }
}
