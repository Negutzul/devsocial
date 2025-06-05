import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { ConversationDto, ProfileDto } from '../../models/message.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConversationListComponent } from './conversation-list/conversation-list.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { User } from '../../models/user.model';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ConversationListComponent,
    ChatWindowComponent
  ]
})
export class MessagesComponent implements OnInit {
  conversations: ConversationDto[] = [];
  selectedUserId: string | null = null;
  selectedUser: User | null = null;
  isMobileView = false;

  constructor(
    private messageService: MessageService,
    private profileService: ProfileService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadConversations();
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());

    // Check if we have a user ID in the route
    this.route.params.subscribe(params => {
      if (params['userId']) {
        this.selectedUserId = params['userId'];
        this.handleNewConversation(params['userId']);
      }
    });
  }

  private checkScreenSize() {
    this.isMobileView = window.innerWidth < 768;
  }

  loadConversations() {
    this.messageService.getConversations().subscribe({
      next: (conversations) => {
        this.conversations = conversations;
        // If we have a selected user, make sure they're in the list
        if (this.selectedUserId) {
          this.handleNewConversation(this.selectedUserId);
        }
      },
      error: (error) => {
        console.error('Error loading conversations:', error);
      }
    });
  }

  private handleNewConversation(userId: string) {
    // Check if conversation already exists
    const existingConversation = this.conversations.find(c => c.userId === userId);
    
    if (existingConversation) {
      // If conversation exists, just select it
      this.onUserSelect(existingConversation.userId);
    } else {
      // If it's a new conversation, get user profile and create conversation
      this.profileService.getUserProfile(userId).subscribe({
        next: (profile) => {
          const newConversation: ConversationDto = {
            userId: profile.id,
            userName: profile.displayName,
            lastMessage: '',
            lastMessageTime: new Date(),
            profilePictureUrl: profile.profilePictureUrl || undefined
          };
          
          this.conversations.unshift(newConversation);
          this.onUserSelect(newConversation.userId);
        },
        error: (error) => {
          console.error('Error loading user profile:', error);
        }
      });
    }
  }

  onUserSelect(userId: string) {
    this.selectedUserId = userId;
    // Find the user from the conversations list
    const conversation = this.conversations.find(c => c.userId === userId);
    if (conversation) {
      this.selectedUser = {
        id: conversation.userId,
        displayName: conversation.userName,
        photoUrl: conversation.profilePictureUrl || undefined,
        email: '' // Email is not available in ConversationDto
      };
    }
  }

  onBackToList() {
    this.selectedUserId = null;
  }
} 