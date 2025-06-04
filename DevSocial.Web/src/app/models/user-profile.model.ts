export interface UserProfile {
  PortfolioUrl: string;
  id: string;
  displayName: string;
  bio: string;
  profilePictureUrl: string | null;
  gitHubUrl: string;
  linkedInUrl: string;
  email: string;
  createdAt: string;
  lastActive: string | null;
} 