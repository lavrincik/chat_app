import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.scss']
})
export class HeadComponent implements OnInit {

  constructor(private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer,
              private chatService: ChatService,
  ) { }

  ngOnInit() {
    this.initIcons();
  }

  private initIcons() {
    this.iconRegistry.addSvgIcon(
      'clear',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/baseline-clear-24px.svg')
    );
  }

  closeSidebar() {
    this.chatService.closeChat();
  }
}
