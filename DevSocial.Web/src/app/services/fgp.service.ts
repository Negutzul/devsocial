import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RepoInfo {
    name: string;
    path: string;
}

export interface BranchInfo {
    name: string;
    isHead: boolean;
    tipSha: string;
}

export interface CommitInfo {
    sha: string;
    message: string;
    author: string;
    date: string;
}

export interface TreeEntry {
    name: string;
    path: string;
    type: string;
    size: number;
}

export interface FileContent {
    content: string;
    encoding: string;
    size: number;
}

export interface FileDiff {
    path: string;
    changeKind: string;
    patch: string;
}

export interface BranchComparison {
    files: FileDiff[];
    commits: CommitInfo[];
    filesChanged: number;
    commitCount: number;
}

export interface PullRequest {
    id: number;
    repoName: string;
    title: string;
    description: string;
    sourceBranch: string;
    targetBranch: string;
    isOpen: boolean;
}

export interface PrComment {
    id: number;
    pullRequestId: number;
    author: string;
    content: string;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class FgpService {
    private baseUrl = 'http://localhost:5298/api';

    constructor(private http: HttpClient) { }

    // Repository operations
    getRepos(): Observable<string[]> {
        return this.http.get<string[]>(`${this.baseUrl}/repos`);
    }

    createRepo(name: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/repos`, { repoName: name });
    }

    deleteRepo(name: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/repos/${name}`);
    }

    // Branch operations
    getBranches(repoName: string): Observable<string[]> {
        return this.http.get<string[]>(`${this.baseUrl}/repos/${repoName}/branches`);
    }

    // Commit operations
    getCommits(repoName: string, branchName: string, page: number = 1, pageSize: number = 10): Observable<CommitInfo[]> {
        return this.http.get<CommitInfo[]>(
            `${this.baseUrl}/repos/${repoName}/branches/${branchName}/commits?page=${page}&pageSize=${pageSize}`
        );
    }

    getCommitDiff(repoName: string, sha: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/repos/${repoName}/commits/${sha}/diff`);
    }

    // File browsing
    getTree(repoName: string, branchName: string, path: string = ''): Observable<TreeEntry[]> {
        const url = path
            ? `${this.baseUrl}/repos/${repoName}/branches/${branchName}/tree?path=${encodeURIComponent(path)}`
            : `${this.baseUrl}/repos/${repoName}/branches/${branchName}/tree`;
        return this.http.get<TreeEntry[]>(url);
    }

    getFileContent(repoName: string, branchName: string, filePath: string): Observable<FileContent> {
        return this.http.get<FileContent>(
            `${this.baseUrl}/repos/${repoName}/branches/${branchName}/files/${filePath}`
        );
    }

    // Branch comparison
    compareBranches(repoName: string, source: string, target: string): Observable<BranchComparison> {
        return this.http.get<BranchComparison>(
            `${this.baseUrl}/repos/${repoName}/compare?source=${encodeURIComponent(source)}&target=${encodeURIComponent(target)}`
        );
    }

    // Pull Requests
    getPullRequests(): Observable<PullRequest[]> {
        return this.http.get<PullRequest[]>(`${this.baseUrl}/pullrequests`);
    }

    createPullRequest(pr: { title: string; sourceBranch: string; targetBranch: string }): Observable<PullRequest> {
        return this.http.post<PullRequest>(`${this.baseUrl}/pullrequests`, pr);
    }

    mergePullRequest(id: number): Observable<any> {
        return this.http.post(`${this.baseUrl}/pullrequests/${id}/merge`, {});
    }

    // PR Comments
    getComments(prId: number): Observable<PrComment[]> {
        return this.http.get<PrComment[]>(`${this.baseUrl}/pullrequests/${prId}/comments`);
    }

    addComment(prId: number, author: string, content: string): Observable<PrComment> {
        return this.http.post<PrComment>(`${this.baseUrl}/pullrequests/${prId}/comments`, { author, content });
    }
}
