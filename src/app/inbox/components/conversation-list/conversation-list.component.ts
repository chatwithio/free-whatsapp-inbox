import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Conversation } from '../../models/conversation.model';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss']
})
export class ConversationListComponent implements OnInit, OnDestroy {
  @Input() selectedConversationId: string | null = null;
  @Input() onlyNoReadMessages: boolean = false;
  // Event when a conversation is selected
  @Output() conversationSelected = new EventEmitter<Conversation>();

  // Conversation list 
  conversations: Conversation[] = [];

  private intervalId: any;
  private sub?: Subscription;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadConversations();

    this.intervalId = setInterval(() => {
      this.loadConversations();
    }, 5000);

    this.sub = this.messageService.refreshPreview$.subscribe(() => {
      this.loadConversations();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadConversations(): void {
    this.messageService.getConversations().subscribe({
      next: (data) => {
        this.conversations = data;
        if (this.onlyNoReadMessages) {
          this.conversations = this.conversations.filter(c => c.unreadCount > 0);
        }
      },
      error: (err) => {
        console.error('Error al cargar las conversaciones:', err);
      }
    });
  }

  onSelectConversation(conversation: Conversation): void {
    this.conversationSelected.emit(conversation);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['onlyNoReadMessages']) {
      this.loadConversations();
    }
  }
}
