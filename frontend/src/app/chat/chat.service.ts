import { Injectable } from '@angular/core';

import { Subject, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

import * as io from 'socket.io-client';

import { HttpClient } from '@angular/common/http';
import { ChatsGetResponse } from './types/request-response/chatGetResponse';
import { Chat } from './types/chat';
import { Message } from './types/message';
import { IMessageState } from './types/iMessageState';
import { MessageState } from './types/messageState';
import { ThisUser } from './types/thisUser';
import { ChatType } from './types/chatType';
import { ChatPatchRequest } from './types/request-response/chatPatchRequest';
import { User } from './types/user';
import { Role } from './types/role';
import { ChatPatchResponse } from './types/request-response/chatPatchResponse';
import { FindMessageChats } from './types/findMessageChats';
import { Flag } from './types/messageFlag';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private _opened = false;
  private openedSource = new Subject<boolean>();
  public opened$ = this.openedSource.asObservable();

  private _chats: Chat[] = [];
  private chatsSource = new Subject<Chat[]>();
  public chats$ = this.chatsSource.asObservable();

  private _findMessage: FindMessageChats = { };
  private findMessageSource = new Subject<FindMessageChats>();
  public findMessage$ = this.findMessageSource.asObservable();

  private socket: SocketIOClient.Socket;

  private _user: ThisUser;
  get user(): ThisUser {
    return this._user;
  }

  private _appContexts: string[];
  get appContexts(): string[] {
    return this._appContexts;
  }

  constructor(private http: HttpClient) { }

  public init(user: ThisUser, appContexts: string[]) {
    this._user = user;
    this._appContexts = appContexts;

    this.getChats();
    
    this.openedSource.subscribe((opened: boolean) => {
      this._opened = opened;
    });

    this.chatsSource.subscribe((chats: Chat[]) => {
      this._chats = chats;
    });

    this.connectToSocket();
  }

  private connectToSocket() {
    this.socket = io('http://localhost:3001/chat');
    this.socket.emit('onConnection', this.user.id);
    this.onMessageReceived();
    this.onMessageState();
    this.onChatClosed();
    this.onMessageDeleted();
    this.onMessageEdited();
    if (this.user.role === Role.employee) {
      this.onUnassignedChatCreated();
    }
  }

  public toogleChat() {
    this.openedSource.next(!this._opened);
  }

  public closeChat() {
    this.openedSource.next(false);
  }

  public toggleColapsedWindow(chatId: number) {
    const _chat: Chat | undefined = this._chats.find((_chat: Chat) => _chat.id === chatId);
    if (_chat) {
      _chat.windowColapsed = !_chat.windowColapsed;
    }
    this.chatsSource.next(this._chats);
  }

  public openWindow(chatId: number) {
    const _chat: Chat | undefined = this._chats.find((_chat: Chat) => _chat.id === chatId);
    if (_chat) {
      _chat.windowOpen = true;
      _chat.windowColapsed = false;
      if (_chat.messages.length === 0) {
        this.getMessages(_chat.id);
      }
    }
    this.chatsSource.next(this._chats);
  }

  public closeWindow(chatId: number) {
    const _chat: Chat | undefined = this._chats.find((_chat: Chat) => _chat.id === chatId);
    if (_chat) {
      _chat.windowOpen = false;
      _chat.windowColapsed = true;
    }
    this.chatsSource.next(this._chats);
  }

  public hideWindow(chatId: number) {
    const _chat: Chat | undefined = this._chats.find((_chat: Chat) => _chat.id === chatId);
    if (_chat) {
      _chat.windowHidden = true;
    }
    this.chatsSource.next(this._chats);
  }

  public showWindow(chatId: number) {
    const _chat: Chat | undefined = this._chats.find((_chat: Chat) => _chat.id === chatId);
    if (_chat) {
      _chat.windowHidden = false;
    }
    this.chatsSource.next(this._chats);
  }

  private getChats() {
    const chatsUrl = `http://localhost:3000/chats/${this.user.id}`;
    
    interval(5000).pipe(
      startWith(0),
      switchMap(() => {
        return this.http.get(chatsUrl)
      })
    ).subscribe((chatsGetResponse: ChatsGetResponse) => {
      for (const chatGetResponse of chatsGetResponse) {
        const chatIndex = this._chats.findIndex((_chat: Chat) => {
          return _chat.id == chatGetResponse.id;
        });

        if (chatIndex != -1) {
          this._chats[chatIndex] = {
            ...this._chats[chatIndex],
            users: [ ...chatGetResponse.users ],
            type: chatGetResponse.type,
            appContext: chatGetResponse.appContext,
            unreadMessages: chatGetResponse.unreadMessages
          }
        } else {
          this._chats.push({
            messages: [],
            allMessagesReceived: false,
            windowOpen: false,
            windowColapsed: false,
            windowHidden: false,
            ...chatGetResponse
          });
        }
      }

      this.chatsSource.next(this._chats);
    });
  }

  private onMessageReceived() {
    this.socket.on('message', (message: Message) => {
      const chatIndex = this._chats.findIndex((_chat: Chat) => {
        return _chat.id == message.chatId;
      })

      this._chats[chatIndex].messages.push(message);
      this._chats[chatIndex].unreadMessages += 1;
      this.chatsSource.next(this._chats);

      this.setMessageState(message.id, IMessageState.delivered);
    });
  }

  private onMessageState() {
    this.socket.on(
      'messageState', 
      (userId: number, messageId: number, state: IMessageState) => {
        let message: Message;
        const chat = this._chats.find((_chat: Chat) => {
          message = _chat.messages.find((_message: Message) => {
            return _message.id == messageId;
          });

          return message ? true : false;
        });

        const messageState: MessageState = message.states.find((_messageState) => {
          return _messageState.userId == userId;
        });


        if (!messageState) {
          return;
        }

        messageState.state = state;
        this.chatsSource.next(this._chats);
      }
    );
  }

  public sendMessage(text: string, chatId: number) {
    const timestamp = new Date();
    const message: Message = {
      text: text,
      timestamp: timestamp,
      chatId: chatId,
      user: {
        id: this.user.id,
        name: this.user.name,
        role: this.user.role,
        connected: true
      },
      states: [],
      sent: false,
      flag: Flag.none
    }

    const chat: Chat = this._chats.find((_chat: Chat) => {
      return _chat.id === chatId;
    });
    const index = chat.messages.push(message);

    this.socket.emit(
      'message', 
      this.user.id, 
      text, 
      timestamp, 
      chatId, 
      this.messageSent(index - 1, chatId)
    );

    message.open = false;
    this.chatsSource.next(this._chats);
  }

  private messageSent = (index: number, chatId: number) => {
    return (message: Message) => {
      const chat: Chat = this._chats.find((_chat: Chat) => {
        return _chat.id === chatId;
      });

      chat.messages[index] = {
        ...message,
        open: chat.messages[index].open
      }
      this.chatsSource.next(this._chats);
    }
  }

  public setMessageState(messageId: number, state: IMessageState) {
    this.socket.emit('messageState', this.user.id, messageId, state);
  }

  public getMessages(chatId: number, limit = 20) {
    const messagesUrl = `http://localhost:3000/messages/${chatId}`;

    const chat: Chat = this._chats.find((_chat: Chat) => {
      return _chat.id === chatId;
    });

    this.http.get(messagesUrl, {
      params: {
        limit: limit.toString(),
        offset: chat.messages.length.toString(),
        userId: this.user.id.toString()
      }
    }).subscribe((messages: Message[]) => {
      if (messages.length < limit) {
        chat.allMessagesReceived = true; 
      }
      
      for (const message of messages) {
        chat.messages.unshift(message);
        message.open = false;

        if (message.user.id == this.user.id) {
          continue;
        }

        const messageState = message.states.find((_messageState: MessageState) => {
          return _messageState.userId == this.user.id;
        });

        if (messageState.state === IMessageState.sent) {
          this.setMessageState(message.id, IMessageState.delivered);
        }
      }

      this.chatsSource.next(this._chats);
    }); 
  }

  public createClientChat(appContext: string) {
    const clientChatCreated = () => {
      return (chat: Chat) => {
        const newChat: Chat = {
          ...chat,
          allMessagesReceived: true,
          windowOpen: true,
          windowColapsed: false,
          windowHidden: false,
        }
        this._chats.push(newChat);
  
        this.chatsSource.next(this._chats);
      }
    }

    this.socket.emit('createUnassignedChat', this.user.id, appContext, clientChatCreated());
  }

  public claimIssue(chatId: number) {
    const chat = this._chats.find((_chat: Chat) => {
      return _chat.id == chatId;
    });

    const client = chat.users.find((user: User) => {
      return user.role === Role.client;
    });

    const chatPatchRequest: ChatPatchRequest = {
      type: ChatType.open,
      users: [
        this.user,
        {
          id: client.id,
          name: client.name,
          role: client.role
        }
      ]
    }

    const chatUrl = `http://localhost:3000/chat/${chat.id}`;
    this.http.patch(chatUrl, chatPatchRequest).subscribe((updatedChat: ChatPatchResponse) => {
      const oldChat = this._chats.find((_chat: Chat) => {
        return _chat.id == updatedChat.id;
      });

      oldChat.type = updatedChat.type;
      if (updatedChat.users) {
        oldChat.users = updatedChat.users.filter((user: User) => user.id != this.user.id);
      }

      this.chatsSource.next(this._chats);
    });
  }

  public closeIssue(chatId: number) {
    this.socket.emit('closeChat', chatId, this.user.id, this.chatClosed(chatId));
  }

  private chatClosed = (chatId: number) => {
    return () => { 
      const chatIndex = this._chats.findIndex((_chat: Chat) => {
        return _chat.id == chatId;
      });
  
      this._chats.splice(chatIndex, 1);
      this.chatsSource.next(this._chats);
    }
  }

  private onChatClosed() {
    this.socket.on('closeChat', (chatId: number) => { 
      const chat = this._chats.find((_chat: Chat) => {
        return _chat.id == chatId;
      });
  
      chat.type = ChatType.closed;
      this.chatsSource.next(this._chats);
    });
  }

  public async findNextMessage(chatId: number, pattern: string, direction: 'next' | 'previous', limit = 20) {
    pattern = pattern.toLowerCase();
    
    let chat: Chat = this._chats.find((_chat: Chat) => {
      return _chat.id === chatId;
    });

    if (this._findMessage[chat.id] && this._findMessage[chat.id].pattern === pattern) {
      const currentMessageFoundIndex = chat.messages.findIndex((_message: Message) => {
        return this._findMessage[chat.id].currentMessageId == _message.id;
      });

      if(direction === 'previous') {
        if (this._findMessage[chat.id].currentMessageId == this._findMessage[chat.id].firstMessageId) {
          if (this._findMessage[chat.id].lastMessageId) {
            this._findMessage[chat.id].currentMessageId = this._findMessage[chat.id].lastMessageId;
            this.findMessageSource.next(this._findMessage);
          }
          return;
        }

        for (let i = currentMessageFoundIndex + 1; i < chat.messages.length; ++i) {
          if (chat.messages[i].found) {
            this._findMessage[chat.id].currentMessageId = chat.messages[i].id;
            this.findMessageSource.next(this._findMessage);
            return;
          }
        }
      }
  
      for (let i = currentMessageFoundIndex - 1; i > 0; --i) {
        if (chat.messages[i].found) {
          this._findMessage[chat.id].currentMessageId = chat.messages[i].id;
          this.findMessageSource.next(this._findMessage);
          return;
        }
      }

      const someMessageFound = await this.getPatternMessages(chat, limit);
      if (someMessageFound === undefined) {
        return;
      }
      if (someMessageFound) {
        this.findMessageSource.next(this._findMessage);
      } else {
        if (!this._findMessage[chat.id].lastMessageId) {
          this._findMessage[chat.id].lastMessageId = this._findMessage[chat.id].currentMessageId;
          this._findMessage[chat.id].currentMessageId = this._findMessage[chat.id].firstMessageId;
          this.findMessageSource.next(this._findMessage);
        } else {
          this._findMessage[chat.id].currentMessageId = this._findMessage[chat.id].firstMessageId;
          this.findMessageSource.next(this._findMessage);
        }
      }
      return;
    }

    if (direction === 'previous') {
      return;
    }

    this._findMessage[chat.id] = {
      pattern,
      currentMessageId: undefined,
      noMessagesFound: true,
      firstMessageId: undefined,
      lastMessageId: undefined
    }

    for (const message of chat.messages) {
      if (message.text.toLowerCase().includes(pattern)) {
        message.found = true;
        this._findMessage[chat.id].noMessagesFound = false;
        this._findMessage[chat.id].currentMessageId = message.id;
        this._findMessage[chat.id].firstMessageId = message.id;
      } else {
        message.found = false;
      }
    }

    if(this._findMessage[chat.id].noMessagesFound) {
      const someMessageFound = await this.getPatternMessages(chat, limit);
      if (someMessageFound === undefined) {
        return;
      }
    }

    this.findMessageSource.next(this._findMessage);
  }

  private async getPatternMessages(chat: Chat, limit: number) {
    let offset = chat.messages.length;
    let chatId = chat.id;
    let someMessageFound = false;
    while(!someMessageFound && !chat.allMessagesReceived) {
      const messagesUrl = `http://localhost:3000/messages/${chatId}`;

      const messages = <Message[]> await this.http.get(messagesUrl, { 
        params: {
          limit: limit.toString(),
          offset: offset.toString(),
          userId: this.user.id.toString()
        }
      }).toPromise();

      offset += limit;

      const chat: Chat = this._chats.find((_chat: Chat) => {
        return _chat.id === chatId;
      });

      if(!this._findMessage[chat.id]) {
        return undefined;
      }

      if (messages.length < limit) {
        chat.allMessagesReceived = true; 
      } 
      
      const firstCall = this._findMessage[chat.id].firstMessageId ? false : true;
      for (const message of messages) {
        if (message.text.toLowerCase().includes(this._findMessage[chat.id].pattern)) {
          message.found = true;
          this._findMessage[chat.id].noMessagesFound = false;
          if (!someMessageFound) {
            this._findMessage[chat.id].currentMessageId = message.id;
            someMessageFound = true;
          }
          if (firstCall) {
            this._findMessage[chat.id].firstMessageId = message.id;
          }
        } else {
          message.found = false;
        }

        chat.messages.unshift(message);
        message.open = false;

        if (message.user.id == this.user.id) {
          continue;
        }

        const messageState = message.states.find((_messageState: MessageState) => {
          return _messageState.userId == this.user.id;
        });

        if (messageState.state === IMessageState.sent) {
          this.setMessageState(message.id, IMessageState.delivered);
        }
      }

      this.chatsSource.next(this._chats);
    }
    return someMessageFound;
  }

  public findStop(chatId: number) {
    delete this._findMessage[chatId];
    this.findMessageSource.next(this._findMessage);
  }

  public deleteMessage(messageId: number) {
    const messageDeleted = (messageId: number) => {
      return () => {
        for (const chat of this._chats) {
          const message = chat.messages.find((_message: Message) => {
            return _message.id == messageId;
          });
  
          if (message) {
            message.flag = Flag.deleted;
            this.chatsSource.next(this._chats);
            return;
          }
        }
      }
    }

    this.socket.emit('deleteMessage', messageId, messageDeleted(messageId));
  }

  public editMessage(messageId: number, editedText: string) {
    const messageEdited = (messageId: number, editedText: string) => {
      return () => {
        for (const chat of this._chats) {
          const message = chat.messages.find((_message: Message) => {
            return _message.id == messageId;
          });
  
          if (message) {
            message.flag = Flag.edited;
            message.editedText = editedText;
            this.chatsSource.next(this._chats);
            return;
          }
        }
      }
    };
    
    this.socket.emit('editMessage', messageId, editedText, messageEdited(messageId, editedText));
  }

  private onMessageDeleted() {
    this.socket.on('deleteMessage', (messageId: number) => { 
      for (const chat of this._chats) {
        const message = chat.messages.find((_message: Message) => {
          return _message.id == messageId;
        });

        if (message) {
          message.flag = Flag.deleted;
          this.chatsSource.next(this._chats);
          return;
        }
      }
    });
  }

  private onMessageEdited() {
    this.socket.on('editMessage', (messageId: number, editedText: string) => { 
      for (const chat of this._chats) {
        const message = chat.messages.find((_message: Message) => {
          return _message.id == messageId;
        });

        if (message) {
          message.flag = Flag.edited;
          message.editedText = editedText;
          this.chatsSource.next(this._chats);
          return;
        }
      }
    });
  }

  private onUnassignedChatCreated() {
    this.socket.on('createUnassignedChat', (chat: Chat) => {
      const newChat: Chat = {
        ...chat,
        allMessagesReceived: true,
        windowOpen: false,
        windowColapsed: false,
        windowHidden: false,
      }
      this._chats.push(newChat);

      this.chatsSource.next(this._chats);
    });
  }
}
