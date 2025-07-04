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
    const url = `${this.backendBaseUrl}/messages`;

    return this.http.get<{ status: string, messages: any[] }>(url).pipe(
      map(response => {
        if (response.status === 'ok') {
          const messages = response.messages;

          // Agrupamos por phoneNumber
          const conversationsMap: { [phoneNumber: string]: any[] } = {};
          messages.forEach(msg => {
            let phoneNumber = msg.contact.replace(/\D/g, '');
            if (!conversationsMap[phoneNumber]) {
              conversationsMap[phoneNumber] = [];
            }
            conversationsMap[phoneNumber].push(msg);
          });

          // Transformamos cada grupo en una conversación
          const conversations: Conversation[] = Object.keys(conversationsMap).map(phoneNumber => {
            const msgs = conversationsMap[phoneNumber];

            // Ordenamos los mensajes de la conversación por fecha (por si acaso)
            const orderedMsgs = msgs.sort((a, b) =>
              new Date(b.created).getTime() - new Date(a.created).getTime()
            );

            const lastMsg = orderedMsgs[0]; // Último mensaje más reciente

            return {
              id: phoneNumber,
              phoneNumber: phoneNumber,
              userName: '',
              lastMessage: lastMsg.text,
              unreadCount: 0
            } as Conversation;
          });

          // Ordenamos las conversaciones por la fecha del último mensaje
          conversations.sort((a, b) =>
            new Date(conversationsMap[b.phoneNumber][0].created).getTime() -
            new Date(conversationsMap[a.phoneNumber][0].created).getTime()
          );

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
            text: msg.text,
            task: msg.task || null,
            oportunity: msg.oportunity || null
          } as Message));
        } else {
          console.error('Error al obtener mensajes:', response);
          return [];
        }
      })
    );
  }

  sendMessage(phoneNumber: string, messageText: string): Observable<any> {
    phoneNumber = phoneNumber.replace(/\D/g, '');
    const url = `${this.backendBaseUrl}/send`;
    const payload = {
      to: phoneNumber,
      message: messageText
    };

    return this.http.post(url, payload);
  }

  getDossiersByOportunity(oportunityId: string): Observable<any[]> {
    const url = `${this.backendBaseUrl}/get-dossieres-task/${oportunityId}`;
    return this.http.get<any[]>(url);
  }

  updateTaskStatus(taskId: string, status: string) {
    taskId = taskId.replace(/\D/g, '');
    const url = `${this.backendBaseUrl}/set-statatus-task/${taskId}/${status}`;
    return this.http.patch(url, {});
  }
}
