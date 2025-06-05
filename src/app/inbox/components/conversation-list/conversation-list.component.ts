import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Conversation } from '../../models/conversation.model';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss']
})
export class ConversationListComponent implements OnInit, OnDestroy {
  @Input() selectedConversationId: string | null = null;
  // Event when a conversation is selected
  @Output() conversationSelected = new EventEmitter<Conversation>();

  // Conversation list 
  conversations: Conversation[] = [];

  private intervalId: any;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadConversations();

    this.intervalId = setInterval(() => {
      this.loadConversations();
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadConversations(): void {
    this.messageService.getConversations().subscribe({
      next: (data) => {
        this.conversations = data;
      },
      error: (err) => {
        console.error('Error al cargar las conversaciones:', err);
      }
    });
  }

  onSelectConversation(conversation: Conversation): void {
    this.conversationSelected.emit(conversation);
  }
}
