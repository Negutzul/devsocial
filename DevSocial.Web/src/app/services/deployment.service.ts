import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DeployProjectRequest {
  githubUrl: string;
  dockerfile: string;
  portMappings: { [key: string]: string };
}

export interface DeploymentResult {
  containerId: string;
  status: string;
  url: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeploymentService {
  private apiUrl = `${environment.apiUrl}/deployment`;

  constructor(private http: HttpClient) {}

  deployProject(request: DeployProjectRequest): Observable<DeploymentResult> {
    return this.http.post<DeploymentResult>(`${this.apiUrl}/deploy`, request);
  }

  getContainerLogs(containerId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/logs/${containerId}`);
  }

  executeCommand(containerId: string, command: string): Observable<CommandResult> {
    return this.http.post<CommandResult>(`${this.apiUrl}/execute/${containerId}`, { containerId, command });
  }

  getContainersDetails(): Observable<ContainerDetails[]> {
    return this.http.get<ContainerDetails[]>(`${this.apiUrl}/containers`);
  }
}

export interface CommandResult {
  output: string;
  error: string;
  exitCode: number;
}

export interface ContainerDetails {
  id: string;
  name: string;
  image: string;
  status: string;
  state: string;
  created: string;
  portMappings: { [key: string]: string };
  networks: { [key: string]: string };
  command: string;
  labels: { [key: string]: string };
} 