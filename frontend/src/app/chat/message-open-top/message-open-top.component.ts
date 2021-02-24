import { Component, OnInit, Input } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { Message } from '../types/message';

@Component({
  selector: 'app-message-open-top',
  templateUrl: './message-open-top.component.html',
  styleUrls: ['./message-open-top.component.scss'],
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
export class MessageOpenTopComponent implements OnInit {
  @Input() message: Message;

  constructor() { }

  ngOnInit(): void {
  }

}
