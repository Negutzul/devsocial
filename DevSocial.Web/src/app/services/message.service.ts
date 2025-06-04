import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ConversationDto, MessageResponseDto, SendMessageDto } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = `${environment.apiUrl}/messages`;
  private baseImagePath = environment.apiUrl.replace('/api', '');
  private defaultAvatarPath = 'assets/default-avatar.svg';

  constructor(private http: HttpClient) {}

  getConversations(): Observable<ConversationDto[]> {
    return this.http.get<ConversationDto[]>(`${this.apiUrl}/conversations`).pipe(
      map(conversations => conversations.map(conv => ({
        ...conv,
        profilePictureUrl: conv.profilePictureUrl ? `${this.baseImagePath}${conv.profilePictureUrl}` : this.defaultAvatarPath
      })))
    );
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