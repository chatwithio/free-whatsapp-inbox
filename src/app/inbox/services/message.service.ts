import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Conversation } from '../models/conversation.model';
import { Message } from '../../inbox/models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private backendBaseUrl = 'https://services.tochat.be/mvp/whatsapp';

  constructor(private http: HttpClient) { }

  getConversations(): Observable<Conversation[]> {
    const url = `${this.backendBaseUrl}/messages`; // Nuevo endpoint sin phoneNumber

    return this.http.get<{ status: string, messages: any[] }>(url).pipe(
      map(response => {
        if (response.status === 'ok') {
          const messages = response.messages;

          // Agrupamos por phoneNumber
          const conversationsMap: { [phoneNumber: string]: any[] } = {};
          messages.forEach(msg => {
            if (!conversationsMap[msg.contact]) {
              conversationsMap[msg.contact] = [];
            }
            conversationsMap[msg.contact].push(msg);
          });

          // Transformamos cada grupo en una conversación
          const conversations: Conversation[] = Object.keys(conversationsMap).map(phoneNumber => {
            const msgs = conversationsMap[phoneNumber];
            const lastMsg = msgs[msgs.length - 1];

            return {
              id: phoneNumber,
              phoneNumber: phoneNumber,
              userName: '',
              lastMessage: lastMsg.text,
              unreadCount: 0
            } as Conversation;
          });

          return conversations;
        } else {
          console.error('Error al obtener conversaciones:', response);
          return [];
        }
      })
    );
  }


  getMessages(conversationId: string): Observable<Message[]> {
    const phoneNumber = conversationId.replace(/\D/g, '');
    const url = `${this.backendBaseUrl}/${phoneNumber}/messages`;

    return this.http.get<{ status: string, messages: any[] }>(url).pipe(
      map(response => {
        if (response.status === 'ok') {
          return response.messages.map(msg => ({
            id: msg.id.toString(),
            conversationId: msg.contact,
            sender: msg.type === 'sent' ? 'agent' : 'client',
            date: new Date(msg.created).toISOString(),
            text: msg.text
          } as Message));
        } else {
          console.error('Error al obtener mensajes:', response);
          return [];
        }
      })
    );
  }

  sendMessage(phoneNumber: string, messageText: string): Observable<any> {
    const url = `${this.backendBaseUrl}/send`;
    const payload = {
      to: phoneNumber,
      message: messageText
    };

    return this.http.post(url, payload);
  }
}

