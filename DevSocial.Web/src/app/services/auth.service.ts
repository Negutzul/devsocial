import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RegisterRequest {
  email: string;
  displayName: string;
  password: string;
}

export interface AuthResponse {
  email: string;
  token: string;
  id: string;
  displayName: string;
  bio: string;
  gitHubUrl: string;
  linkedInUrl: string;
  profilePictureUrl: string | null;
  createdAt: string;
  lastActive: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  register(registerData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, registerData);
  }
} 