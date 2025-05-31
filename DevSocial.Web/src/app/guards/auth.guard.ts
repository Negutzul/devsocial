import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  console.log('Auth guard executing...');
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();
  console.log('Is user logged in?', isLoggedIn);

  if (isLoggedIn) {
    console.log('User is logged in, allowing access');
    return true;
  }

  console.log('User is not logged in, redirecting to login');
  return router.parseUrl('/login');
}; 