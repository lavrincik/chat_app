import { Component, OnInit } from '@angular/core';
import { Chat } from '../types/chat';
import { ChatService } from '../chat.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-windows',
  templateUrl: './windows.component.html',
  styleUrls: ['./windows.component.scss']
})
export class WindowsComponent implements OnInit {
  chatsPosition = '220px';
  chats: Chat[];

  constructor(
    private chatService: ChatService,
  ) { }

  ngOnInit() {
    this.chatService.chats$.pipe(
      switchMap((_chats: Chat[]) => {
        return of(_chats.filter((chat: Chat) => chat.windowOpen))
      })
    ).subscribe((_chats: Chat[]) => {
      this.chats = [..._chats];
    });

    this.chatService.opened$.subscribe((opened: boolean) => {
      this.chatsPosition = opened ? '220px' : '0px';
    });
  }

  trackByFn(index: number, chat: Chat ) {
    return chat.id;
  }
}
