import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  emailError: string = '';
  passwordError: string = '';
  isSubmitting: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onSubmit() {
    // Reset error messages
    this.emailError = '';
    this.passwordError = '';
    this.isSubmitting = true;

    // Validate email
    if (!this.isValidEmail(this.loginData.email)) {
      this.emailError = 'Please enter a valid email address';
      this.isSubmitting = false;
      return;
    }

    // Validate password is not empty
    if (!this.loginData.password) {
      this.passwordError = 'Password is required';
      this.isSubmitting = false;
      return;
    }

    // Call the login service
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        // TODO: Store the token and user data
        console.log('Login successful:', response);
        this.router.navigate(['/feed']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        if (error.status === 401) {
          this.passwordError = 'Invalid email or password';
        } else {
          this.emailError = 'Login failed. Please try again.';
        }
        this.isSubmitting = false;
      }
    });
  }
} 