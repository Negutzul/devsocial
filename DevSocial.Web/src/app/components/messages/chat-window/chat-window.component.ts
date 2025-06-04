import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from '../../../services/message.service';
import { MessageResponseDto, SendMessageDto } from '../../../models/message.model';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChatWindowComponent implements OnInit {
  @Input() userId!: string;
  @Output() backToList = new EventEmitter<void>();

  messages: MessageResponseDto[] = [];
  newMessage = '';
  currentUserId: string;

  constructor(
    private messageService: MessageService,
    private authService: AuthService
  ) {
    const userData = this.authService.getUserData();
    if (!userData) {
      throw new Error('User data not found');
    }
    this.currentUserId = userData.id;
  }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.messageService.getConversation(this.userId).subscribe({
      next: (messages) => {
        this.messages = messages;
      },
      error: (error) => {
        console.error('Error loading messages:', error);
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const message: SendMessageDto = {
      recipientId: this.userId,
      content: this.newMessage.trim()
    };

    this.messageService.sendMessage(message).subscribe({
      next: (response) => {
        this.messages.push(response);
        this.newMessage = '';
      },
      error: (error) => {
        console.error('Error sending message:', error);
      }
    });
  }

  deleteMessage(messageId: number) {
    this.messageService.deleteMessage(messageId).subscribe({
      next: () => {
        this.messages = this.messages.filter(m => m.id !== messageId);
      },
      error: (error) => {
        console.error('Error deleting message:', error);
      }
    });
  }
} 