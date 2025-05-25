export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    email: string;
    password: string;
    confirmPassword: string;
    displayName: string;
    username: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        displayName: string;
        username: string;
    };
} 