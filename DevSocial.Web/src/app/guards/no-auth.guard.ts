import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  console.log('No-auth guard executing...');
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();
  console.log('Is user logged in?', isLoggedIn);

  if (!isLoggedIn) {
    console.log('User is not logged in, allowing access to auth pages');
    return true;
  }

  console.log('User is logged in, redirecting to feed');
  return router.parseUrl('/feed');
}; 