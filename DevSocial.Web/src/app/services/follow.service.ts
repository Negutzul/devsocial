import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  followUser(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/userfollows/follow/${userId}`, {});
  }

  unfollowUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/userfollows/unfollow/${userId}`);
  }

  getFollowers(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/userfollows/followers/${userId}`);
  }

  getFollowing(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/userfollows/following/${userId}`);
  }

  getFollowStats(userId: string): Observable<{ followersCount: number, followingCount: number }> {
    return this.http.get<{ followersCount: number, followingCount: number }>(`${this.apiUrl}/userfollows/stats/${userId}`);
  }
} 