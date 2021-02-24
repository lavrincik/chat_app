import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ChatComponent } from './chat/chat.component';
import { WindowsComponent } from './windows/windows.component';
import { HeadComponent } from './head/head.component';

import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BodyComponent } from './body/body.component';
import { AutoResizeDirective } from './directives/auto-resize.directive';
import { ClosedWindowComponent } from './closed-window/closed-window.component';
import { OpenWindowComponent } from './open-window/open-window.component';
import { OpenWindowFooterComponent } from './open-window-footer/open-window-footer.component';
import { OpenWindowHeadComponent } from './open-window-head/open-window-head.component';
import { MessageComponent } from './message/message.component';
import { MessageOpenBottom } from './message-open-bottom/message-open-bottom.component';
import { ContactSupportComponent } from './contact-support/contact-support.component';
import { HighlightSearchPipe } from './pipes/highlight-search.pipe';
import { MessageDeleteDialogComponent } from './message-delete-dialog/message-delete-dialog.component';
import { MessageEditDialogComponent } from './message-edit-dialog/message-edit-dialog.component';
import { ClaimIssueDialogComponent } from './claim-issue-dialog/claim-issue-dialog.component';
import { ContactSupportDialogComponent } from './contact-support-dialog/contact-support-dialog.component';
import { CloseIssueDialogComponent } from './close-issue-dialog/close-issue-dialog.component';
import { MessageOpenTopComponent } from './message-open-top/message-open-top.component';

@NgModule({
  declarations: [
    ChatComponent,
    WindowsComponent,
    HeadComponent,
    BodyComponent,
    AutoResizeDirective,
    ClosedWindowComponent,
    OpenWindowComponent,
    OpenWindowFooterComponent,
    OpenWindowHeadComponent,
    MessageComponent,
    MessageOpenBottom,
    ContactSupportComponent,
    HighlightSearchPipe,
    MessageDeleteDialogComponent,
    MessageEditDialogComponent,
    ClaimIssueDialogComponent,
    ContactSupportDialogComponent,
    CloseIssueDialogComponent,
    MessageOpenTopComponent,
  ],
  entryComponents: [
    ContactSupportDialogComponent,
    ClaimIssueDialogComponent,
    CloseIssueDialogComponent,
    MessageDeleteDialogComponent,
    MessageEditDialogComponent
  ],
  exports: [ChatComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatRippleModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatListModule,
    MatDividerModule,
    MatMenuModule,
    MatButtonToggleModule,
  ],
  providers: [HighlightSearchPipe]
})
export class ChatModule { }
