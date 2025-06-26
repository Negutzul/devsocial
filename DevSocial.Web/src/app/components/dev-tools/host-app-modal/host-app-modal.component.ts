import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DeploymentService, DeploymentResult } from '../../../services/deployment.service';

interface PortMapping {
  id: number;
  hostPort: string;
  containerPort: string;
}

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
  portMappings: PortMapping[] = [];
  isSubmitting: boolean = false;
  deploymentResult: DeploymentResult | null = null;
  error: string = '';
  private nextPortMappingId: number = 1;

  constructor(private deploymentService: DeploymentService) {}

  addPortMapping() {
    this.portMappings.push({
      id: this.nextPortMappingId++,
      hostPort: '',
      containerPort: ''
    });
  }

  removePortMapping(id: number) {
    this.portMappings = this.portMappings.filter(mapping => mapping.id !== id);
  }

  private cleanDockerfileContent(content: string): string {
    
    let cleaned = content
      .replace(/\\"/g, '"')  // Convert \" to "
      .replace(/\\'/g, "'")  // Convert \' to '
      .replace(/\\\\/g, '\\'); // Convert \\ to \ (this handles \\n, \\t, \\r, etc.)
    
    // Convert literal \n strings to actual newlines
    cleaned = cleaned.replace(/\\n/g, '\n');
    
    console.log('After cleaning:', cleaned);
    return cleaned;
  }

  onSubmit() {
    this.isSubmitting = true;
    this.error = '';
    this.deploymentResult = null;


    // Convert port mappings array to the expected format
    const portMappingsObject: { [key: string]: string } = {};
    this.portMappings.forEach(mapping => {
      if (mapping.hostPort && mapping.containerPort) {
        portMappingsObject[mapping.hostPort.toString()] = mapping.containerPort.toString();
      }
    });

    // Clean up the Dockerfile content
    const cleanedDockerfile = this.cleanDockerfileContent(this.dockerfile);
    
    const requestBody = {
      githubUrl: this.githubUrl,
      dockerfile: cleanedDockerfile,
      portMappings: portMappingsObject
    };

    // Debug: Log the final request body
    console.log('Request body:', requestBody);

    this.deploymentService.deployProject(requestBody).subscribe({
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