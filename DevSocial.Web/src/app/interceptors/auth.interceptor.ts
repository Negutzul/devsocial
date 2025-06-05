import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  console.log('AuthInterceptor - Processing request:', {
    url: req.url,
    method: req.method,
    hasToken: !!token
  });
  
  if (token) {
    console.log('AuthInterceptor - Adding token to request');
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    console.log('AuthInterceptor - No token available');
  }
  
  return next(req);
}; 