import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { ProfileDto } from '../../models/message.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isMenuOpen = false;
  searchTerm = '';
  searchResults: ProfileDto[] = [];
  showSearchResults = false;
  private searchSubject = new Subject<string>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      if (term) {
        this.searchProfiles(term);
      } else {
        this.searchResults = [];
        this.showSearchResults = false;
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  onSearch() {
    this.searchSubject.next(this.searchTerm);
  }

  searchProfiles(term: string) {
    this.profileService.searchProfiles(term).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.showSearchResults = results.length > 0;
      },
      error: (error) => {
        console.error('Error searching profiles:', error);
        this.searchResults = [];
        this.showSearchResults = false;
      }
    });
  }

  onProfileClick(userId: string) {
    // Close mobile menu if it's open
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
    }
    
    // Clear search and results
    this.searchTerm = '';
    this.searchResults = [];
    this.showSearchResults = false;
    
    // Navigate to profile
    this.router.navigate(['/profile', userId]).then(() => {
      // Force a reload of the profile page to ensure fresh data
      window.location.reload();
    });
  }

  onSearchBlur() {
    // Delay hiding results to allow for clicking on results
    setTimeout(() => {
      this.showSearchResults = false;
    }, 200);
  }
}
