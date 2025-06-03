import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Conversation } from '../models/conversation.model';
import { Message } from '../../inbox/models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private conversationsUrl = '/assets/mock-data/conversations.json';
  private messagesUrl = '/assets/mock-data/messages.json';

  constructor(private http: HttpClient) { }

  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(this.conversationsUrl);
  }

  getMessages(conversationId: string): Observable<Message[]> {
    return this.http.get<{ [key: string]: Message[] }>(this.messagesUrl).pipe(
      map(data => data[conversationId] || [])
    );
  }
}

