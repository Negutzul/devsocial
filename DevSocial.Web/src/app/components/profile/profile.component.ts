import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserProfile } from '../../models/user-profile.model';
import { 
  faMapMarkerAlt, 
  faCalendar, 
  faGlobe, 
  faEdit, 
  faUserPlus, 
  faEnvelope, 
  faShare 
} from '@fortawesome/free-solid-svg-icons';
import { 
  faGithub, 
  faLinkedin 
} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnChanges {
  @Input() profile: UserProfile | null = null;
  isOwnProfile: boolean = false;
  isLoading: boolean = true;
  error: string | null = null;
  profilePictureUrl: string = 'assets/default-avatar.svg';

  // Font Awesome Icons
  faMapMarkerAlt = faMapMarkerAlt;
  faCalendar = faCalendar;
  faGlobe = faGlobe;
  faEdit = faEdit;
  faUserPlus = faUserPlus;
  faEnvelope = faEnvelope;
  faShare = faShare;
  faGithub = faGithub;
  faLinkedin = faLinkedin;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const userId = params['userId'];
      if (userId) {
        // Load specific user's profile
        this.profileService.getUserProfile(userId).subscribe({
          next: (profile) => {
            this.profile = profile;
            this.loadProfile();
          },
          error: (error) => {
            console.error('Error loading profile:', error);
            this.error = 'Failed to load profile';
            this.isLoading = false;
          }
        });
      } else {
        // Load current user's profile
        this.loadProfile();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['profile']) {
      this.loadProfile();
    }
  }

  private loadProfile() {
    this.isLoading = true;
    this.error = null;

    if (this.profile) {
      // If profile is provided as input, check if it's the current user's profile
      const currentUser = this.authService.getUserData();
      this.isOwnProfile = currentUser?.id === this.profile.id;
      this.loadProfilePicture();
    } else {
      // If no profile is provided, load current user's profile
      const currentUser = this.authService.getUserData();
      if (currentUser) {
        this.profile = {
          PortfolioUrl: currentUser.portfolioUrl || '',
          id: currentUser.id,
          displayName: currentUser.displayName,
          bio: currentUser.bio || '',
          profilePictureUrl: currentUser.profilePictureUrl,
          gitHubUrl: currentUser.gitHubUrl || '',
          linkedInUrl: currentUser.linkedInUrl || '',
          email: currentUser.email,
          createdAt: currentUser.createdAt,
          lastActive: currentUser.lastActive
        };
        this.isOwnProfile = true;
        this.loadProfilePicture();
      } else {
        this.error = 'No user data available';
      }
    }
    this.isLoading = false;
  }

  private loadProfilePicture() {
    if (!this.profile) return;

    if (this.isOwnProfile) {
      this.profileService.getCurrentUserProfilePicture().subscribe({
        next: (response) => {
          this.profilePictureUrl = response.url;
        },
        error: (error) => {
          console.error('Error loading profile picture:', error);
          this.profilePictureUrl = 'assets/default-avatar.svg';
        }
      });
    } else {
      this.profileService.getUserProfilePicture(this.profile.id).subscribe({
        next: (response) => {
          this.profilePictureUrl = response.url;
        },
        error: (error) => {
          console.error('Error loading profile picture:', error);
          this.profilePictureUrl = 'assets/default-avatar.svg';
        }
      });
    }
  }

  onEditProfile() {
    // TODO: Implement edit profile functionality
    console.log('Edit profile clicked');
  }

  onFollow() {
    // TODO: Implement follow functionality
    console.log('Follow clicked');
  }

  onMessage() {
    // TODO: Implement message functionality
    console.log('Message clicked');
  }

  onShare() {
    // TODO: Implement share functionality
    console.log('Share clicked');
  }
} 