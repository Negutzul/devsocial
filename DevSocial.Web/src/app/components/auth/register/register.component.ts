import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

  onSubmit() {
    // TODO: Implement registration logic
    console.log('Register attempt:', this.registerData);
  }
} 