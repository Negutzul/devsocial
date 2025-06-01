import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.apiUrl;
  private baseImagePath = 'http://localhost:5285';
  private defaultAvatarPath = 'assets/default-avatar.svg';

  constructor(private http: HttpClient) { }

  getCurrentUserProfilePicture(): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.apiUrl}/profilepicture/current`)
      .pipe(
        map(response => ({
          url: response.url ? `${this.baseImagePath}${response.url}` : this.defaultAvatarPath
        }))
      );
  }

  getUserProfilePicture(userId: string): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.apiUrl}/profilepicture/${userId}`)
      .pipe(
        map(response => ({
          url: response.url ? `${this.baseImagePath}${response.url}` : this.defaultAvatarPath
        }))
      );
  }

  uploadProfilePicture(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/profilepicture/upload`, formData)
      .pipe(
        map(response => ({
          url: response.url ? `${this.baseImagePath}${response.url}` : this.defaultAvatarPath
        }))
      );
  }

  removeProfilePicture(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/profilepicture/remove`);
  }
} 