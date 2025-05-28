import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerData = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  passwordError: string = '';
  emailError: string = '';
  isSubmitting: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 6 || password.length > 100) {
      errors.push('Password must be between 6 and 100 characters');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must have at least one uppercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must have at least one digit');
    }
    
    if (!/[^a-zA-Z0-9]/.test(password)) {
      errors.push('Password must have at least one non-alphanumeric character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  onSubmit() {
    // Reset error messages
    this.passwordError = '';
    this.emailError = '';
    this.isSubmitting = true;

    // Validate email
    if (!this.isValidEmail(this.registerData.email)) {
      this.emailError = 'Please enter a valid email address';
      this.isSubmitting = false;
      return;
    }

    // Validate password
    const passwordValidation = this.isValidPassword(this.registerData.password);
    if (!passwordValidation.isValid) {
      this.passwordError = passwordValidation.errors.join('. ');
      this.isSubmitting = false;
      return;
    }

    // Check if passwords match
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.passwordError = 'Passwords do not match';
      this.isSubmitting = false;
      return;
    }

    // Prepare registration data
    const registerRequest = {
      email: this.registerData.email,
      displayName: this.registerData.displayName,
      password: this.registerData.password
    };

    // Call the registration service
    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        // TODO: Store the token and user data
        console.log('Registration successful:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        if (Array.isArray(error.error)) {
          // Handle array of password validation errors
          this.passwordError = error.error.map((err: any) => err.description).join('. ');
        } else if (error.error?.errors?.Password) {
          this.passwordError = error.error.errors.Password[0];
        } else {
          this.emailError = error.error?.title || 'Registration failed. Please try again.';
        }
        this.isSubmitting = false;
      }
    });
  }
} 