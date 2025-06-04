export interface SendMessageDto {
  recipientId: string;
  content: string;
}

export interface MessageResponseDto {
  id: number;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  content: string;
  sentAt: Date;
}

export interface ConversationDto {
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: Date;
  profilePictureUrl?: string;
}

export interface ProfileDto {
  id: string;
  displayName: string;
  bio?: string;
  gitHubUrl?: string;
  linkedInUrl?: string;
  profilePictureUrl?: string;
  createdAt: Date;
  lastActive: Date;
} 