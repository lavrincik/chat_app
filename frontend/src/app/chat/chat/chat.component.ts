import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../chat.service';
import { User } from '../types/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @Input() user: User;
  @Input() appContexts: string[];
  opened: boolean;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.chatService.opened$.subscribe((opened: boolean) => {
      this.opened = opened;
    });
  }
}
