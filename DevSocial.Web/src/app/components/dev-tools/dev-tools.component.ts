import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostAppModalComponent } from './host-app-modal/host-app-modal.component';
import { ContainerDetailsModalComponent } from './container-details-modal/container-details-modal.component';
import { InteractContainerModalComponent } from './interact-container-modal/interact-container-modal.component';

@Component({
  selector: 'app-dev-tools',
  standalone: true,
  imports: [CommonModule, HostAppModalComponent, ContainerDetailsModalComponent, InteractContainerModalComponent],
  templateUrl: './dev-tools.component.html',
  styleUrls: ['./dev-tools.component.css']
})
export class DevToolsComponent {
  showHostModal = false;
  showContainerDetailsModal = false;
  showInteractContainerModal = false;

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

  openInteractContainerModal() {
    this.showInteractContainerModal = true;
  }

  closeInteractContainerModal() {
    this.showInteractContainerModal = false;
  }
} 