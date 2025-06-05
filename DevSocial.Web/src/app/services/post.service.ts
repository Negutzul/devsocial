import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Post } from '../models/post.model';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPosts(page: number = 1, pageSize: number = 10, feedType: 'all' | 'following' = 'all'): Observable<Post[]> {
    console.log('PostService - Making request to get posts');
    
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('feedType', feedType);

    return this.http.get<Post[]>(`${this.apiUrl}/posts`, { params }).pipe(
      tap(response => {
        console.log('PostService - Received response:', response);
      }),
      catchError(error => {
        console.error('PostService - Error fetching posts:', error);
        throw error;
      })
    );
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/posts/${id}`);
  }

  createPost(post: Partial<Post>): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts`, post);
  }

  updatePost(id: number, post: Partial<Post>): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/posts/${id}`, post);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/posts/${id}`);
  }

  likePost(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/posts/${id}/like`, {});
  }

  unlikePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/posts/${id}/like`);
  }

  // Comment-related methods
  getComments(postId: number): Observable<Comment[]> {
    const params = new HttpParams().set('postId', postId.toString());
    return this.http.get<Comment[]>(`${this.apiUrl}/comments`, { params });
  }

  createComment(postId: number, content: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/comments`, { postId, content });
  }

  deleteComment(postId: number, commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comments/${commentId}`);
  }
} 