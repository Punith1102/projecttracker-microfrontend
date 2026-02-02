export interface User {
    userId: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';
}

export interface AuthResponse {
    token: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'USER';
    userId: number;
    expiresIn: number;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}
