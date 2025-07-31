import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-conversation-new-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conversation-new-modal.component.html',
  styleUrl: './conversation-new-modal.component.scss'
})
export class ConversationNewModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() start = new EventEmitter<{ phone: string; message: string }>();

  phone: string = '';
  message: string = '';

  startConversation() {
    if (this.phone && this.message) {
      this.start.emit({ phone: this.phone, message: this.message });
    }
  }

  closeModal() {
    this.close.emit();
  }
}
