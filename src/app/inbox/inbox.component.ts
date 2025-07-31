import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationListComponent } from './components/conversation-list/conversation-list.component';
import { ConversationViewComponent } from './components/conversation-view/conversation-view.component';
import { Conversation } from './models/conversation.model';
import { FormsModule } from '@angular/forms';
import { MessageService } from './services/message.service';
import { ToastrService } from 'ngx-toastr';
import { ConversationNewModalComponent } from './components/conversation-new-modal/conversation-new-modal.component';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    CommonModule,
    ConversationListComponent,
    ConversationViewComponent,
    FormsModule,
    ConversationNewModalComponent
  ],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent {
  selectedConversationId: string | null = null;
  selectedConversation: Conversation | null = null;
  showModal = false;

  constructor(private messageService: MessageService, private toast: ToastrService) { }


  onConversationSelected(conversation: Conversation): void {
    this.selectedConversationId = conversation.phoneNumber;
    this.selectedConversation = conversation;
  }

  handleNewConversation({ phone, message }: { phone: string; message: string }) {
    this.messageService.sendMessage(phone, message).subscribe({
      next: () => {
        this.toast.success('Conversación iniciada correctamente');
        this.showModal = false;
      },
      error: () => {
        this.toast.error('Error al iniciar la conversación');
      }
    });
  }


}
