import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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

interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  bio: string;
  profilePicture: string;
  location: string;
  skills: string[];
  currentRole: string;
  company: string;
  website: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  joinDate: Date;
  isPublic: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  isOwnProfile: boolean = false;
  isLoading: boolean = true;
  error: string | null = null;

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

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // TODO: Get profile data from API
    this.loadProfile();
  }

  private loadProfile() {
    // For now, we'll use mock data
    this.profile = {
      id: '1',
      username: 'johndoe',
      fullName: 'John Doe',
      bio: 'Full-stack developer passionate about web technologies and open source.',
      profilePicture: '',
      location: 'New York, USA',
      skills: ['JavaScript', 'TypeScript', 'Angular', 'Node.js', 'Python'],
      currentRole: 'Senior Developer',
      company: 'Tech Corp',
      website: 'https://johndoe.dev',
      email: 'john@example.com',
      githubUrl: 'https://github.com/johndoe',
      linkedinUrl: 'https://linkedin.com/in/johndoe',
      joinDate: new Date('2024-01-01'),
      isPublic: true
    };

    // Check if this is the user's own profile
    const currentUser = this.authService.getUserData();
    this.isOwnProfile = currentUser?.id === this.profile.id;
    this.isLoading = false;
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