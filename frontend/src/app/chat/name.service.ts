import { Injectable } from '@angular/core';
import { User } from './types/user';
import { Role } from './types/role';
import { Chat } from './types/chat';
import { ChatType } from './types/chatType';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root'
})
export class NameService {

  constructor(private chatService: ChatService) { }

  getChatName(chat: Chat) {
    switch (this.chatService.user.role) {
      case Role.client: 
        return chat.appContext;
      case Role.employee:
        return this.getEmployeeChatName(chat);
    }
  }

  private getEmployeeChatName(chat: Chat) {
    switch(chat.type) {
      case ChatType.open:
      case ChatType.employee:
        let names = '';
        for (const user of chat.users) {
          if (names !== '') {
            names += ', ';
          }
          names += user.name;
        }
        return names;
      case ChatType.unassigned:
        const client = chat.users.find((user: User) => user.role === Role.client);
        return client.name;
    }
  }
}
