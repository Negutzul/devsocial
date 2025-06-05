import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from '../../../../models/comment.model';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="comment">
      <div class="comment-header">
        <span class="comment-author">{{ comment.authorDisplayName }}</span>
        <span class="comment-date">{{ comment.createdAt | date:'MMM d, y, h:mm a' }}</span>
      </div>
      <div class="comment-content">
        {{ comment.content }}
      </div>
    </div>
  `,
  styles: [`
    .comment {
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }
    .comment-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    .comment-author {
      font-weight: 600;
      color: #374151;
    }
    .comment-date {
      color: #6b7280;
      font-size: 0.875rem;
    }
    .comment-content {
      color: #1f2937;
    }
  `]
})
export class CommentComponent {
  @Input() comment!: Comment;
} 