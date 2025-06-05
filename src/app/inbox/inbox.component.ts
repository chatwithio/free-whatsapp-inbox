import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationListComponent } from './components/conversation-list/conversation-list.component';
import { ConversationViewComponent } from './components/conversation-view/conversation-view.component';
import { Conversation } from './models/conversation.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    CommonModule,
    ConversationListComponent,
    ConversationViewComponent,
    FormsModule
  ],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent {
  selectedConversationId: string | null = null;
  selectedConversation: Conversation | null = null;

  agents: string[] = ['Valeria Alcaine', 'Pedro Rodríguez', 'Marta Yuste', 'Alejandro Urzola'];
  assignedAgent: string = this.agents[0];

  internalNotes: string = '';


  onConversationSelected(conversation: Conversation): void {
    this.selectedConversationId = conversation.phoneNumber;
    this.selectedConversation = conversation;
  }
}
