import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DeploymentService, DeploymentResult } from '../../../services/deployment.service';

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
  portMappings: { [key: string]: string } = {};
  isSubmitting: boolean = false;
  deploymentResult: DeploymentResult | null = null;
  error: string = '';

  constructor(private deploymentService: DeploymentService) {}

  onSubmit() {
    this.isSubmitting = true;
    this.error = '';
    this.deploymentResult = null;

    this.deploymentService.deployProject({
      githubUrl: this.githubUrl,
      dockerfile: this.dockerfile,
      portMappings: this.portMappings
    }).subscribe({
      next: (result: DeploymentResult) => {
        this.deploymentResult = result;
        this.isSubmitting = false;
      },
      error: (err: any) => {
        this.error = err.error?.error || 'An error occurred during deployment';
        this.isSubmitting = false;
      }
    });
  }

  onClose() {
    this.close.emit();
  }
} 