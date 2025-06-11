import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-host-app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './host-app-modal.component.html',
  styleUrls: ['./host-app-modal.component.css']
})
export class HostAppModalComponent {
  @Output() close = new EventEmitter<void>();
  
  githubUrl: string = '';
  dockerfile: string = '';
  isSubmitting: boolean = false;

  onSubmit() {
    this.isSubmitting = true;
    // TODO: Implement the submission logic
    console.log('GitHub URL:', this.githubUrl);
    console.log('Dockerfile:', this.dockerfile);
  }

  onClose() {
    this.close.emit();
  }
} 