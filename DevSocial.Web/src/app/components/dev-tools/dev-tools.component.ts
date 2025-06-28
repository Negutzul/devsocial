import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostAppModalComponent } from './host-app-modal/host-app-modal.component';
import { ContainerDetailsModalComponent } from './container-details-modal/container-details-modal.component';

@Component({
  selector: 'app-dev-tools',
  standalone: true,
  imports: [CommonModule, HostAppModalComponent, ContainerDetailsModalComponent],
  templateUrl: './dev-tools.component.html',
  styleUrls: ['./dev-tools.component.css']
})
export class DevToolsComponent {
  showHostModal = false;
  showContainerDetailsModal = false;

  openHostModal() {
    this.showHostModal = true;
  }

  closeHostModal() {
    this.showHostModal = false;
  }

  openContainerDetailsModal() {
    this.showContainerDetailsModal = true;
  }

  closeContainerDetailsModal() {
    this.showContainerDetailsModal = false;
  }
} 