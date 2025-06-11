import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostAppModalComponent } from './host-app-modal/host-app-modal.component';

@Component({
  selector: 'app-dev-tools',
  standalone: true,
  imports: [CommonModule, HostAppModalComponent],
  templateUrl: './dev-tools.component.html',
  styleUrls: ['./dev-tools.component.css']
})
export class DevToolsComponent {
  showHostModal = false;

  openHostModal() {
    this.showHostModal = true;
  }

  closeHostModal() {
    this.showHostModal = false;
  }
} 