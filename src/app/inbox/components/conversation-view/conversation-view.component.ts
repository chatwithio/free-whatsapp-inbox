import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../models/message.model';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import { WhatsappFormatPipe } from '../../../shared/pipes/whatsapp-format.pipe';
import { TASK_STATUSES } from '../../../shared/constants/task-statuses';

@Component({
  selector: 'app-conversation-view',
  standalone: true,
  imports: [CommonModule, FormsModule, WhatsappFormatPipe],
  templateUrl: './conversation-view.component.html',
  styleUrls: ['./conversation-view.component.scss']
})
export class ConversationViewComponent implements OnInit, OnDestroy, OnChanges {
  @Input() conversationId: string | null = null;
  @ViewChild('bottom') private bottom!: ElementRef<HTMLDivElement>;

  messages: Message[] = [];
  newMessageText: string = '';
  isSending: boolean = false;
  currentOportunity: string | null = null;
  currentTask: string | null = null;
  dossiers: any[] = [];
  taskStatuses = TASK_STATUSES;
  selectedTaskStatus: string | null = null;

  private shouldScrollToBottom: boolean = false;
  private intervalId: any;
  private dossiersLoaded: boolean = false;

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
      this.dossiersLoaded = false;
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
        const newMessages = data;

        // Comprobamos si hay mensajes nuevos
        const lastLoadedMessage = this.messages[this.messages.length - 1];
        const lastNewMessage = newMessages[newMessages.length - 1];

        const hasNewMessages =
          !lastLoadedMessage ||
          !lastNewMessage ||
          lastLoadedMessage.id !== lastNewMessage.id;

        this.messages = newMessages;

        // Cargamos los dossieres
        if (!this.dossiersLoaded && this.messages.length > 0) {
          this.loadDossiers();
          this.dossiersLoaded = true;
        }

        // Solo hacemos scroll si hay mensajes nuevos
        this.shouldScrollToBottom = hasNewMessages;
      },
      error: (err) => {
        console.error('Error al cargar los mensajes:', err);
      }
    });

  }

  loadDossiers(): void {
    // Buscar si hay algún mensaje con task o oportunity
    const taskMessage = this.messages.find(msg => msg.task);
    const oportunityMessage = this.messages.find(msg => msg.oportunity);
    this.currentTask = taskMessage ? taskMessage.task : null;
    this.currentOportunity = oportunityMessage ? oportunityMessage.oportunity : null;

    // Llamar al endpoint para obtener los dossieres
    if (this.currentOportunity) {
      this.messageService.getDossiersByOportunity(this.currentOportunity).subscribe({
        next: (data) => {
          this.dossiers = data;
        },
        error: (err) => {
          console.error('Error al cargar los dossieres:', err);
        }
      });
    }
  }

  sendMessage(): void {
    const messageText = this.newMessageText.trim();
    if (!messageText || this.isSending) {
      return;
    }

    if (!this.conversationId) {
      console.error('No hay conversationId definido.');
      return;
    }

    this.isSending = true;

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
          text: messageText,
          task: null,
          oportunity: null
        };

        this.messages.push(newMessage);
        this.newMessageText = '';
        this.shouldScrollToBottom = true;
        this.isSending = false;
      },
      error: (error) => {
        console.error('Error al enviar el mensaje', error);
        this.isSending = false;
      }
    });
  }

  changeTaskStatus(): void {
    if (!this.currentTask || !this.selectedTaskStatus) return;

    this.messageService.updateTaskStatus(this.currentTask, this.selectedTaskStatus).subscribe({
      next: () => {
        console.log('Tarea actualizada');
      },
      error: (err) => {
        console.error('Error al actualizar la tarea:', err);
      }
    });
  }

  private scrollToBottom(): void {
    if (this.bottom) {
      this.bottom.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }


}
