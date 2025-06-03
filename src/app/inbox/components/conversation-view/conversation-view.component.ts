import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../models/message.model';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-conversation-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conversation-view.component.html',
  styleUrls: ['./conversation-view.component.scss']
})
export class ConversationViewComponent implements OnChanges {
  @Input() conversationId: string | null = null;
  @ViewChild('bottom') private bottom!: ElementRef<HTMLDivElement>;

  messages: Message[] = [];
  newMessageText: string = '';

  private shouldScrollToBottom: boolean = false;

  constructor(private messageService: MessageService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversationId'] && this.conversationId) {
      this.loadMessages();
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  loadMessages(): void {
    this.messageService.getMessages(this.conversationId!).subscribe({
      next: (data) => {
        this.messages = data;
        this.shouldScrollToBottom = true;
      },
      error: (err) => {
        console.error('Error al cargar los mensajes:', err);
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessageText.trim()) {
      return;
    }

    const newMessage: Message = {
      id: 'msg-' + new Date().getTime(),
      conversationId: this.conversationId!,
      sender: 'agent',
      date: new Date().toISOString(),
      text: this.newMessageText.trim()
    };

    this.messages.push(newMessage);
    this.newMessageText = '';

    this.shouldScrollToBottom = true;
  }

  private scrollToBottom(): void {
    if (this.bottom) {
      this.bottom.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
