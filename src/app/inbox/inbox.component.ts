import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationListComponent } from './components/conversation-list/conversation-list.component';
import { ConversationViewComponent } from './components/conversation-view/conversation-view.component';
import { Conversation } from './models/conversation.model';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    CommonModule,
    ConversationListComponent,
    ConversationViewComponent
  ],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent {
  selectedConversationId: string | null = null;

  onConversationSelected(conversation: Conversation): void {
    this.selectedConversationId = conversation.id;
  }
}
