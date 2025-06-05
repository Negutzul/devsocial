import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../../models/post.model';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
  @Input() post!: Post;
  @Output() postUpdated = new EventEmitter<Post>();

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
} 