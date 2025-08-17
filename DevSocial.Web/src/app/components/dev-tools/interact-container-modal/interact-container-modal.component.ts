import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeploymentService, CommandResult } from '../../../services/deployment.service';

@Component({
  selector: 'app-interact-container-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interact-container-modal.component.html',
  styleUrls: ['./interact-container-modal.component.css']
})
export class InteractContainerModalComponent {
  @Output() close = new EventEmitter<void>();
  
  containerId: string = '';
  command: string = '';
  logs: string = '';
  commandResult: CommandResult | null = null;
  isLoadingLogs: boolean = false;
  isLoadingCommand: boolean = false;
  error: string = '';

  constructor(private deploymentService: DeploymentService) {}

  pasteFromClipboard() {
    navigator.clipboard.readText().then(text => {
      this.containerId = text;
    }).catch(err => {
      console.error('Failed to read from clipboard:', err);
    });
  }

  getLogs() {
    if (!this.containerId.trim()) {
      this.error = 'Please enter a container ID';
      return;
    }

    this.isLoadingLogs = true;
    this.error = '';
    this.logs = '';

    this.deploymentService.getContainerLogs(this.containerId.trim()).subscribe({
      next: (logs: string) => {
        this.logs = logs;
        this.isLoadingLogs = false;
      },
      error: (err: any) => {
        this.error = err.error?.error || 'Failed to get container logs';
        this.isLoadingLogs = false;
      }
    });
  }

  executeCommand() {
    if (!this.containerId.trim()) {
      this.error = 'Please enter a container ID';
      return;
    }

    if (!this.command.trim()) {
      this.error = 'Please enter a command';
      return;
    }

    this.isLoadingCommand = true;
    this.error = '';
    this.commandResult = null;

    this.deploymentService.executeCommand(this.containerId.trim(), this.command.trim()).subscribe({
      next: (result: CommandResult) => {
        this.commandResult = result;
        this.isLoadingCommand = false;
      },
      error: (err: any) => {
        this.error = err.error?.error || 'Failed to execute command';
        this.isLoadingCommand = false;
      }
    });
  }

  clearLogs() {
    this.logs = '';
    this.error = '';
  }

  clearCommandResult() {
    this.commandResult = null;
    this.command = '';
    this.error = '';
  }

  onClose() {
    this.close.emit();
  }
} 