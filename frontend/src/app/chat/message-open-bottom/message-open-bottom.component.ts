import { Component, OnInit, Input } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { Message } from '../types/message';
import { MessageState } from '../types/messageState';
import { ChatService } from '../chat.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { IMessageState } from '../types/iMessageState';

@Component({
  selector: 'app-message-open-bottom',
  templateUrl: './message-open-bottom.component.html',
  styleUrls: ['./message-open-bottom.component.scss'],
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
export class MessageOpenBottom implements OnInit {
  @Input() message: Message;

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private chatService: ChatService,
  ) { }

  ngOnInit(): void {
    this.iconRegistry.addSvgIcon(
      'check-filled',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/check_circle-filled-24dp.svg')
    );
    this.iconRegistry.addSvgIcon(
      'visibility',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/visibility-24dp.svg')
    );
  }

  someStateSeen() {
    return this.message.states.some((state: MessageState) => {
      return state.state === IMessageState.seen && state.userId != this.chatService.user.id;
    });
  }

  someStateDelivered() {
    return this.message.states.some((state: MessageState) => {
      return state.state === IMessageState.delivered && state.userId != this.chatService.user.id;
    });
  }

  stateSeenNames() {
    let names = '';
    for (const state of this.message.states) {
      if (state.state === IMessageState.seen && state.userId != this.chatService.user.id) {
        if (names !== '') {
          names += ', ';
        }
        names += state.name;
      }
    }
    return names;
  }

  stateDeliveredNames() {
    let names = '';
    for (const state of this.message.states) {
      if (state.state === IMessageState.delivered && state.userId != this.chatService.user.id) {
        if (names !== '') {
          names += ', ';
        }
        names += state.name;
      }
    }
    return names;
  }
}
