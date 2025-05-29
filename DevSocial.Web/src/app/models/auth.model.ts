export interface RegisterRequest {
    email: string;
    displayName: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    email: string;
    token: string;
    id: string;
    displayName: string;
    bio: string;
    gitHubUrl: string;
    linkedInUrl: string;
    profilePictureUrl: string | null;
    createdAt: string;
    lastActive: string | null;
} 