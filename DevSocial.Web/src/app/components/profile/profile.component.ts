import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { FollowService } from '../../services/follow.service';
import { MessageService } from '../../services/message.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserProfile } from '../../models/user-profile.model';
import { 
  faMapMarkerAlt, 
  faCalendar, 
  faGlobe, 
  faEdit, 
  faUserPlus, 
  faEnvelope, 
  faShare,
  faUserMinus
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
  isFollowing: boolean = false;
  followersCount: number = 0;
  followingCount: number = 0;

  // Font Awesome Icons
  faMapMarkerAlt = faMapMarkerAlt;
  faCalendar = faCalendar;
  faGlobe = faGlobe;
  faEdit = faEdit;
  faUserPlus = faUserPlus;
  faUserMinus = faUserMinus;
  faEnvelope = faEnvelope;
  faShare = faShare;
  faGithub = faGithub;
  faLinkedin = faLinkedin;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private followService: FollowService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const userId = params['userId'];
      if (userId) {
        // Load specific user's profile
        this.loadUserProfile(userId);
      } else {
        // Load current user's profile
        const currentUser = this.authService.getUserData();
        if (currentUser?.id) {
          this.loadUserProfile(currentUser.id);
        } else {
          this.error = 'User not logged in';
          this.isLoading = false;
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['profile'] && this.profile) {
      this.loadProfile();
    }
  }

  private loadUserProfile(userId: string) {
    this.isLoading = true;
    this.error = null;

    this.profileService.getUserProfile(userId).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.loadProfile();
        this.loadFollowStats();
        this.checkFollowStatus();
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.error = 'Failed to load profile';
        this.isLoading = false;
      }
    });
  }

  private loadProfile() {
    if (!this.profile) return;

    const currentUser = this.authService.getUserData();
    this.isOwnProfile = currentUser?.id === this.profile.id;

    if (this.profile.profilePictureUrl) {
      this.profilePictureUrl = this.profile.profilePictureUrl;
    }

    this.isLoading = false;
  }

  private loadFollowStats() {
    if (!this.profile) return;

    this.followService.getFollowStats(this.profile.id).subscribe({
      next: (stats) => {
        this.followersCount = stats.followersCount;
        this.followingCount = stats.followingCount;
      },
      error: (error) => {
        console.error('Error loading follow stats:', error);
      }
    });
  }

  private checkFollowStatus() {
    if (!this.profile || this.isOwnProfile) return;

    const currentUser = this.authService.getUserData();
    if (!currentUser) return;

    this.followService.getFollowers(this.profile.id).subscribe({
      next: (followers) => {
        this.isFollowing = followers.some(follower => follower.id === currentUser.id);
      },
      error: (error) => {
        console.error('Error checking follow status:', error);
      }
    });
  }

  onEditProfile() {
    // TODO: Implement edit profile functionality
    console.log('Edit profile clicked');
  }

  onFollow() {
    if (!this.profile || this.isOwnProfile) return;

    if (this.isFollowing) {
      this.followService.unfollowUser(this.profile.id).subscribe({
        next: () => {
          this.isFollowing = false;
          this.followersCount--;
        },
        error: (error) => {
          console.error('Error unfollowing user:', error);
        }
      });
    } else {
      this.followService.followUser(this.profile.id).subscribe({
        next: () => {
          this.isFollowing = true;
          this.followersCount++;
        },
        error: (error) => {
          console.error('Error following user:', error);
        }
      });
    }
  }

  onMessage() {
    if (!this.profile || this.isOwnProfile) return;
    this.router.navigate(['/messages', this.profile.id]);
  }

  onShare() {
    if (!this.profile) return;
    
    // Get the current URL
    const url = window.location.href;
    
    // Check if the Web Share API is available
    if (navigator.share) {
      navigator.share({
        title: `${this.profile.displayName}'s Profile`,
        text: `Check out ${this.profile.displayName}'s profile on DevSocial!`,
        url: url
      }).catch(error => {
        console.error('Error sharing:', error);
      });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(url).then(() => {
        alert('Profile URL copied to clipboard!');
      }).catch(error => {
        console.error('Error copying to clipboard:', error);
      });
    }
  }
} 