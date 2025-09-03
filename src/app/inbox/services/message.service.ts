import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';
import { Conversation } from '../models/conversation.model';
import { Message } from '../../inbox/models/message.model';
import { environment } from '../../../environments/environment';

type ApiListResponse = {
  status: string;
  messages: any[];
};

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private backendBaseUrl = environment.inboxApiBaseUrl;
  private _refreshPreview$ = new Subject<void>();
  refreshPreview$ = this._refreshPreview$.asObservable();

  constructor(private http: HttpClient) { }

  triggerRefreshPreview() {
    this._refreshPreview$.next();
  }

  /**
   * Conversaciones = último mensaje de cada contacto.
   * Usamos /messages/preview que ya devuelve un mensaje por contacto.
   */
  getConversations(): Observable<Conversation[]> {
    const url = `${this.backendBaseUrl}/messages/preview`;
    // const url = `https://services.tochat.be/mvp/whatsapp/34654131150/messages`;
    return this.http.get<ApiListResponse>(url).pipe(
      map((response) => {
        if (response.status !== 'ok') return [];
        const conversations = response.messages.map((m: any) => {
          const phoneNumber = (m.contact ?? '').replace(/\D/g, '');
          return {
            id: phoneNumber,
            phoneNumber,
            userName: '',
            lastMessage: m.text ?? '',
            unreadCount: m.unreadCount ?? 0
          } as Conversation;
        });

        // Ordenar por fecha del último mensaje (desc)
        conversations.sort((a: any, b: any) => {
          const ma = response.messages.find((m: any) => (m.contact ?? '').replace(/\D/g, '') === a.phoneNumber);
          const mb = response.messages.find((m: any) => (m.contact ?? '').replace(/\D/g, '') === b.phoneNumber);
          const ta = ma ? new Date(ma.created).getTime() : 0;
          const tb = mb ? new Date(mb.created).getTime() : 0;
          return tb - ta;
        });

        return conversations;
      })
    );

  }

  /**
   * Detalle de mensajes por conversación.
   * El backend acepta GET con body para limit/offset. Angular lo permite.
   */
  getMessages(conversationId: string, limit = 100, offset = 0): Observable<Message[]> {
    const phoneNumber = conversationId.replace(/\D/g, '');
    const url = `${this.backendBaseUrl}/${phoneNumber}/messages`;

    return this.http.get<ApiListResponse>(url, {
      params: { limit, offset }
    }).pipe(
      map((response) => {
        if (!response || (response as any).status !== 'ok') return [];
        const r = response as ApiListResponse;

        return r.messages.map((msg: any) => ({
          id: String(msg.id),
          conversationId: msg.contact,
          sender: (msg.type === 'sent') ? 'agent' : 'client',
          date: new Date((msg.created ?? '').replace(' ', 'T')).toISOString(),
          text: msg.text ?? ''
        } as Message));
      })
    );
  }

  /**
   * Envío de mensaje: /send
   */
  sendMessage(phoneNumber: string, messageText: string): Observable<any> {
    const to = phoneNumber.replace(/\D/g, '');
    const url = `${this.backendBaseUrl}/send`;
    const payload = { to, message: messageText };
    return this.http.post(url, payload);
  }

  /**
   * Marca un mensaje como leído por el receptor.
   */
  markConversationRead(conversationId: string) {
    const phoneNumber = conversationId.replace(/\D/g, '');
    const url = `${this.backendBaseUrl}/${phoneNumber}/read`;
    const body: any = {};
    return this.http.post<{ status: string; updated: number }>(url, body);
  }
}
