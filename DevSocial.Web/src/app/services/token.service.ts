import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp?: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  constructor() { }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return null;

    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const expirationTime = decodedToken.exp ? decodedToken.exp * 1000 : 0; // Convert to milliseconds
      
      if (expirationTime && Date.now() >= expirationTime) {
        // Token has expired
        this.logout();
        return null;
      }
      
      return token;
    } catch {
      // If token is invalid, remove it
      this.logout();
      return null;
    }
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  setUserData(userData: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
  }

  getUserData(): any {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  removeUserData(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.removeToken();
    this.removeUserData();
  }
} 