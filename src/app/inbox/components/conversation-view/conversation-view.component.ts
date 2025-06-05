import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
export class ConversationViewComponent implements OnInit, OnDestroy, OnChanges {
  @Input() conversationId: string | null = null;
  @ViewChild('bottom') private bottom!: ElementRef<HTMLDivElement>;

  messages: Message[] = [];
  newMessageText: string = '';

  private shouldScrollToBottom: boolean = false;
  private intervalId: any;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadMessages();

    this.intervalId = setInterval(() => {
      this.loadMessages();
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

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
    const messageText = this.newMessageText.trim();
    if (!messageText) {
      return;
    }

    if (!this.conversationId) {
      console.error('No hay conversationId definido.');
      return;
    }

    // Llamar al servicio
    this.messageService.sendMessage(this.conversationId, messageText).subscribe({
      next: (response) => {
        console.log('Mensaje enviado correctamente', response);

        // Añadimos el mensaje al array local para que aparezca inmediatamente
        const newMessage: Message = {
          id: 'msg-' + new Date().getTime(),
          conversationId: this.conversationId,
          sender: 'agent',
          date: new Date().toISOString(),
          text: messageText
        };

        this.messages.push(newMessage);
        this.newMessageText = '';
        this.shouldScrollToBottom = true;
      },
      error: (error) => {
        console.error('Error al enviar el mensaje', error);
      }
    });
  }

  private scrollToBottom(): void {
    if (this.bottom) {
      this.bottom.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
