import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DeploymentService } from '../../../services/deployment.service';

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
  deploymentResult: any = null;
  error: string = '';

  constructor(private deploymentService: DeploymentService) {}

  onSubmit() {
    this.isSubmitting = true;
    this.error = '';
    this.deploymentResult = null;

    this.deploymentService.deployProject({
      githubUrl: this.githubUrl,
      dockerfile: this.dockerfile
    }).subscribe({
      next: (result) => {
        this.deploymentResult = result;
        this.isSubmitting = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'An error occurred during deployment';
        this.isSubmitting = false;
      }
    });
  }

  onClose() {
    this.close.emit();
  }
} 