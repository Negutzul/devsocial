import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../services/message.service';
import { ProfileService } from '../../../services/profile.service';
import { ConversationDto, ProfileDto } from '../../../models/message.model';
import { debounceTime, distinctUntilChanged, map, Subject } from 'rxjs';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ConversationListComponent implements OnInit {
  @Input() selectedUserId: string | null = null;
  @Input() conversations: ConversationDto[] = [];
  @Output() selectConversation = new EventEmitter<string>();

  searchTerm = '';
  searchResults: ProfileDto[] = [];
  showDropdown = false;
  private searchSubject = new Subject<string>();
  private defaultAvatarPath = 'assets/default-avatar.svg';

  constructor(
    private messageService: MessageService,
    private profileService: ProfileService
  ) {
    // Set up debounced search
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(term => {
        if (term) {
          this.profileService.searchProfiles(term).pipe(
            map(results => results.map(user => ({
              ...user,
              profilePictureUrl: user.profilePictureUrl || this.defaultAvatarPath
            })))
          ).subscribe({
            next: (results) => {
              this.searchResults = results.slice(0, 5); // Limit to 5 results
            },
            error: (error) => {
              console.error('Error searching profiles:', error);
            }
          });
        } else {
          this.searchResults = [];
        }
      });
  }

  ngOnInit() {
    // No need to load conversations here since they're passed as input
  }

  onSearch() {
    this.searchSubject.next(this.searchTerm);
  }

  onBlur() {
    // Delay hiding the dropdown to allow for click events
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  startConversation(user: ProfileDto) {
    // Check if conversation already exists
    const existingConversation = this.conversations.find(c => c.userId === user.id);
    
    if (existingConversation) {
      // If conversation exists, just select it
      this.selectConversation.emit(existingConversation.userId);
    } else {
      // If it's a new conversation, create it and add to the list
      const newConversation: ConversationDto = {
        userId: user.id,
        userName: user.displayName,
        lastMessage: '',
        lastMessageTime: new Date(),
        profilePictureUrl: user.profilePictureUrl
      };
      
      this.conversations.unshift(newConversation);
      this.selectConversation.emit(newConversation.userId);
    }

    // Clear search
    this.searchTerm = '';
    this.searchResults = [];
    this.showDropdown = false;
  }

  onConversationSelect(userId: string) {
    this.selectConversation.emit(userId);
  }
} 