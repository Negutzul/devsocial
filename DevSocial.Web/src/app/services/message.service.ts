import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ConversationDto, MessageResponseDto, SendMessageDto } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = `${environment.apiUrl}/messages`;

  constructor(private http: HttpClient) {}

  getConversations(): Observable<ConversationDto[]> {
    return this.http.get<ConversationDto[]>(`${this.apiUrl}/conversations`);
  }

  getConversation(userId: string): Observable<MessageResponseDto[]> {
    return this.http.get<MessageResponseDto[]>(`${this.apiUrl}/conversation/${userId}`);
  }

  sendMessage(message: SendMessageDto): Observable<MessageResponseDto> {
    return this.http.post<MessageResponseDto>(this.apiUrl, message);
  }

  deleteMessage(messageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${messageId}`);
  }
} 