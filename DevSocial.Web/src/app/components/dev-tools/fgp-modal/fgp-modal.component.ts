import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    FgpService,
    CommitInfo,
    TreeEntry,
    BranchComparison,
    PullRequest,
    PrComment
} from '../../../services/fgp.service';

@Component({
    selector: 'app-fgp-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './fgp-modal.component.html',
    styleUrls: ['./fgp-modal.component.css']
})
export class FgpModalComponent implements OnInit {
    @Output() close = new EventEmitter<void>();

    activeTab: 'repos' | 'browse' | 'prs' | 'compare' = 'repos';

    // Repos tab
    repos: string[] = [];
    newRepoName = '';
    reposLoading = false;
    reposError = '';

    // Browse tab
    selectedRepo = '';
    branches: string[] = [];
    selectedBranch = '';
    treeEntries: TreeEntry[] = [];
    currentPath: string[] = [];
    fileContent = '';
    viewingFile = false;
    browseLoading = false;
    browseError = '';

    // PRs tab
    pullRequests: PullRequest[] = [];
    prsLoading = false;
    showCreatePr = false;
    newPrTitle = '';
    newPrSource = '';
    newPrTarget = '';
    prBranches: string[] = [];
    selectedPrId: number | null = null;
    prComments: PrComment[] = [];
    newCommentAuthor = '';
    newCommentContent = '';

    // Compare tab
    compareRepo = '';
    compareBranches: string[] = [];
    sourceCompare = '';
    targetCompare = '';
    comparison: BranchComparison | null = null;
    compareLoading = false;
    compareError = '';

    constructor(private fgp: FgpService) { }

    ngOnInit() {
        this.loadRepos();
    }

    onClose() {
        this.close.emit();
    }

    switchTab(tab: 'repos' | 'browse' | 'prs' | 'compare') {
        this.activeTab = tab;
        if (tab === 'repos') this.loadRepos();
        if (tab === 'prs') this.loadPullRequests();
    }

    // ===== REPOS TAB =====

    loadRepos() {
        this.reposLoading = true;
        this.reposError = '';
        this.fgp.getRepos().subscribe({
            next: (repos) => { this.repos = repos; this.reposLoading = false; },
            error: (err) => { this.reposError = 'Failed to load repositories'; this.reposLoading = false; }
        });
    }

    createRepo() {
        if (!this.newRepoName.trim()) return;
        this.fgp.createRepo(this.newRepoName.trim()).subscribe({
            next: () => { this.newRepoName = ''; this.loadRepos(); },
            error: (err) => { this.reposError = err.error || 'Failed to create repository'; }
        });
    }

    deleteRepo(name: string) {
        if (!confirm(`Delete repository "${name}"? This cannot be undone.`)) return;
        this.fgp.deleteRepo(name).subscribe({
            next: () => this.loadRepos(),
            error: (err) => { this.reposError = 'Failed to delete repository'; }
        });
    }

    // ===== BROWSE TAB =====

    selectRepoForBrowse(repoName: string) {
        this.selectedRepo = repoName;
        this.selectedBranch = '';
        this.treeEntries = [];
        this.currentPath = [];
        this.viewingFile = false;
        this.browseLoading = true;
        this.fgp.getBranches(repoName).subscribe({
            next: (branches) => { this.branches = branches; this.browseLoading = false; },
            error: () => { this.browseLoading = false; }
        });
    }

    selectBranch(branchName: string) {
        this.selectedBranch = branchName;
        this.currentPath = [];
        this.viewingFile = false;
        this.loadTree();
    }

    loadTree() {
        this.browseLoading = true;
        const path = this.currentPath.join('/');
        this.fgp.getTree(this.selectedRepo, this.selectedBranch, path).subscribe({
            next: (entries) => { this.treeEntries = entries; this.browseLoading = false; this.viewingFile = false; },
            error: () => { this.browseLoading = false; }
        });
    }

    navigateToFolder(entry: TreeEntry) {
        this.currentPath.push(entry.name);
        this.loadTree();
    }

    navigateUp() {
        this.currentPath.pop();
        this.loadTree();
    }

    navigateToPathIndex(index: number) {
        this.currentPath = this.currentPath.slice(0, index + 1);
        this.loadTree();
    }

    viewFile(entry: TreeEntry) {
        this.browseLoading = true;
        this.browseError = '';
        const filePath = [...this.currentPath, entry.name].join('/');
        this.fgp.getFileContent(this.selectedRepo, this.selectedBranch, filePath).subscribe({
            next: (file) => { this.fileContent = file.content; this.viewingFile = true; this.browseLoading = false; },
            error: (err) => { this.browseError = err.error || 'Failed to load file'; this.browseLoading = false; }
        });
    }

    backToTree() {
        this.viewingFile = false;
    }

    // ===== PRS TAB =====

    loadPullRequests() {
        this.prsLoading = true;
        this.fgp.getPullRequests().subscribe({
            next: (prs) => { this.pullRequests = prs; this.prsLoading = false; },
            error: () => { this.prsLoading = false; }
        });
    }

    toggleCreatePr() {
        this.showCreatePr = !this.showCreatePr;
        if (this.showCreatePr && this.repos.length > 0) {
            // Load branches for the first repo for PR creation
            this.fgp.getBranches(this.repos[0]).subscribe({
                next: (branches) => { this.prBranches = branches; }
            });
        }
    }

    submitPr() {
        if (!this.newPrTitle || !this.newPrSource || !this.newPrTarget) return;
        this.fgp.createPullRequest({
            title: this.newPrTitle,
            sourceBranch: this.newPrSource,
            targetBranch: this.newPrTarget
        }).subscribe({
            next: () => {
                this.newPrTitle = '';
                this.newPrSource = '';
                this.newPrTarget = '';
                this.showCreatePr = false;
                this.loadPullRequests();
            }
        });
    }

    mergePr(id: number) {
        this.fgp.mergePullRequest(id).subscribe({
            next: () => this.loadPullRequests(),
            error: (err) => alert(err.error || 'Merge failed')
        });
    }

    viewPrComments(prId: number) {
        this.selectedPrId = this.selectedPrId === prId ? null : prId;
        if (this.selectedPrId) {
            this.fgp.getComments(prId).subscribe({
                next: (comments) => this.prComments = comments
            });
        }
    }

    addComment() {
        if (!this.selectedPrId || !this.newCommentContent.trim()) return;
        this.fgp.addComment(this.selectedPrId, this.newCommentAuthor || 'Anonymous', this.newCommentContent).subscribe({
            next: () => {
                this.newCommentContent = '';
                this.fgp.getComments(this.selectedPrId!).subscribe({
                    next: (comments) => this.prComments = comments
                });
            }
        });
    }

    // ===== COMPARE TAB =====

    expandedFiles = new Set<string>();

    toggleFileDiff(path: string) {
        if (this.expandedFiles.has(path)) {
            this.expandedFiles.delete(path);
        } else {
            this.expandedFiles.add(path);
        }
    }

    selectRepoForCompare(repoName: string) {
        this.compareRepo = repoName;
        this.sourceCompare = '';
        this.targetCompare = '';
        this.comparison = null;
        this.expandedFiles.clear();
        this.fgp.getBranches(repoName).subscribe({
            next: (branches) => this.compareBranches = branches
        });
    }

    runComparison() {
        if (!this.compareRepo || !this.sourceCompare || !this.targetCompare) return;
        this.compareLoading = true;
        this.compareError = '';
        this.expandedFiles.clear();
        this.fgp.compareBranches(this.compareRepo, this.sourceCompare, this.targetCompare).subscribe({
            next: (result) => { this.comparison = result; this.compareLoading = false; },
            error: (err) => { this.compareError = err.error || 'Comparison failed'; this.compareLoading = false; }
        });
    }
}
