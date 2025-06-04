import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProfileDto } from '../models/message.model';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.apiUrl;
  private baseImagePath = environment.apiUrl.replace('/api', '');
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

  searchProfiles(searchTerm: string): Observable<ProfileDto[]> {
    return this.http.get<ProfileDto[]>(`${this.apiUrl}/profiles/search`, {
      params: { searchTerm }
    }).pipe(
      map(profiles => profiles.map(profile => ({
        ...profile,
        profilePictureUrl: profile.profilePictureUrl ? `${this.baseImagePath}${profile.profilePictureUrl}` : this.defaultAvatarPath
      })))
    );
  }

  getUserProfile(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profiles/${userId}`).pipe(
      map(profile => ({
        ...profile,
        profilePictureUrl: profile.profilePictureUrl ? `${this.baseImagePath}${profile.profilePictureUrl}` : this.defaultAvatarPath
      }))
    );
  }
} 