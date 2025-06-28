import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeploymentService, ContainerDetails } from '../../../services/deployment.service';

@Component({
  selector: 'app-container-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './container-details-modal.component.html',
  styleUrls: ['./container-details-modal.component.css']
})
export class ContainerDetailsModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  
  containers: ContainerDetails[] = [];
  isLoading: boolean = true;
  error: string = '';
  Object = Object; // Make Object available in template

  constructor(private deploymentService: DeploymentService) {}

  ngOnInit() {
    this.loadContainers();
  }

  loadContainers() {
    this.isLoading = true;
    this.error = '';
    
    this.deploymentService.getContainersDetails().subscribe({
      next: (containers: ContainerDetails[]) => {
        this.containers = containers;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = err.error?.error || 'Failed to load container details';
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    if (status.toLowerCase().includes('running')) {
      return 'status-running';
    } else if (status.toLowerCase().includes('stopped')) {
      return 'status-stopped';
    } else if (status.toLowerCase().includes('exited')) {
      return 'status-exited';
    }
    return 'status-unknown';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here if you want
      console.log('Container ID copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err);
    });
  }

  onClose() {
    this.close.emit();
  }

  refreshContainers() {
    this.loadContainers();
  }
} 