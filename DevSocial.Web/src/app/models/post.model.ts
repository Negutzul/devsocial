export interface Post {
  id: number;
  title: string;
  content: string;
  codeSnippet?: string;
  codeLanguage?: string;
  imageUrl?: string;
  authorId: string;
  authorName: string;
  authorProfilePictureUrl?: string;
  createdAt: string;
  updatedAt?: string;
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
  tags: string[];
} 