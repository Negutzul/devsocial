import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from '../../../models/post.model';
import { Comment } from '../../../models/comment.model';
import { PostService } from '../../../services/post.service';
import { CommentComponent } from './comment/comment.component';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormsModule, CommentComponent],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
  @Input() post!: Post;
  @Output() postUpdated = new EventEmitter<Post>();

  comments: Comment[] = [];
  showComments: boolean = false;
  newComment: string = '';
  isLoadingComments: boolean = false;

  constructor(private postService: PostService) {}

  onLikeClick() {
    if (this.post.isLikedByCurrentUser) {
      this.postService.unlikePost(this.post.id).subscribe({
        next: () => {
          this.post.isLikedByCurrentUser = false;
          this.post.likeCount--;
          this.postUpdated.emit(this.post);
        },
        error: (error) => {
          console.error('Error unliking post:', error);
        }
      });
    } else {
      this.postService.likePost(this.post.id).subscribe({
        next: () => {
          this.post.isLikedByCurrentUser = true;
          this.post.likeCount++;
          this.postUpdated.emit(this.post);
        },
        error: (error) => {
          console.error('Error liking post:', error);
        }
      });
    }
  }

  toggleComments() {
    this.showComments = !this.showComments;
    if (this.showComments && this.comments.length === 0) {
      this.loadComments();
    }
  }

  loadComments() {
    this.isLoadingComments = true;
    this.postService.getComments(this.post.id).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.isLoadingComments = false;
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.isLoadingComments = false;
      }
    });
  }

  submitComment() {
    if (!this.newComment.trim()) return;

    this.postService.createComment(this.post.id, this.newComment).subscribe({
      next: (comment) => {
        this.comments.unshift(comment);
        this.post.commentCount++;
        this.postUpdated.emit(this.post);
        this.newComment = '';
      },
      error: (error) => {
        console.error('Error creating comment:', error);
      }
    });
  }
} 