import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../models/post.model';
import { PostComponent } from './post/post.component';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, PostComponent],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  posts: Post[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  currentPage: number = 1;
  pageSize: number = 10;
  hasMorePosts: boolean = true;
  feedType: 'all' | 'following' = 'all';

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router
  ) {
    console.log('FeedComponent constructor - Auth state:', {
      isLoggedIn: this.authService.isLoggedIn(),
      token: this.authService.getToken(),
      userData: this.authService.getUserData()
    });
  }

  ngOnInit() {
    console.log('FeedComponent ngOnInit - Checking auth state...');
    const isLoggedIn = this.authService.isLoggedIn();
    console.log('Is user logged in?', isLoggedIn);
    
    if (!isLoggedIn) {
      console.log('User not logged in, redirecting to login...');
      this.router.navigate(['/login']);
      return;
    }

    console.log('User is logged in, proceeding to load posts...');
    this.loadPosts();
  }

  loadPosts() {
    if (this.isLoading || !this.hasMorePosts) {
      console.log('Skipping loadPosts - hasMorePosts:', this.hasMorePosts, 'isLoading:', this.isLoading);
      return;
    }

    this.isLoading = true;
    this.error = null;

    console.log('Starting to load posts with params:', {
      page: this.currentPage,
      pageSize: this.pageSize,
      feedType: this.feedType,
      isLoggedIn: this.authService.isLoggedIn(),
      token: this.authService.getToken(),
      userData: this.authService.getUserData()
    });

    this.postService.getPosts(this.currentPage, this.pageSize, this.feedType)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error loading posts:', {
            status: error.status,
            statusText: error.statusText,
            error: error.error,
            headers: error.headers,
            url: error.url
          });

          if (error.status === 401) {
            console.log('Unauthorized error, logging out and redirecting to login...');
            this.authService.logout();
            this.router.navigate(['/login']);
          } else {
            this.error = error.error?.message || 'Failed to load posts';
          }
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (newPosts) => {
          console.log('Posts loaded successfully:', newPosts);
          
          if (this.currentPage === 1) {
            this.posts = newPosts;
          } else {
            this.posts = [...this.posts, ...newPosts];
          }
          
          this.hasMorePosts = newPosts.length === this.pageSize;
          console.log('Updated hasMorePosts:', this.hasMorePosts, 'Received posts:', newPosts.length);
        }
      });
  }

  onPostUpdated(updatedPost: Post) {
    const index = this.posts.findIndex(p => p.id === updatedPost.id);
    if (index !== -1) {
      this.posts[index] = updatedPost;
    }
  }

  loadMore() {
    if (this.hasMorePosts && !this.isLoading) {
      this.currentPage++;
      this.loadPosts();
    }
  }

  toggleFeedType() {
    this.feedType = this.feedType === 'all' ? 'following' : 'all';
    this.currentPage = 1;
    this.hasMorePosts = true;
    this.loadPosts();
  }

  onScroll(event: any) {
    const element = event.target;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    
    if (atBottom) {
      this.loadMore();
    }
  }
} 