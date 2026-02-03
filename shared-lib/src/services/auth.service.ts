import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, timeout, BehaviorSubject, Subscription, interval } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.models';
import { environment } from '../environments/environment';

interface JwtPayload {
    exp?: number;
    role?: string;
    authority?: string;
    sub?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;

    private timerSubscription: Subscription | null = null;
    private lastActivityTime: number = Date.now();
    private sessionTimeout = 5 * 60 * 1000;
    private readonly EXTEND_PROMPT_THRESHOLD = 60 * 1000;
    private extendPromptShown = false;

    public timeRemaining$ = new BehaviorSubject<string>('');
    public showExtendPrompt$ = new BehaviorSubject<boolean>(false);

    private authChannel = new BroadcastChannel('auth_channel');

    constructor(private http: HttpClient, private router: Router, private ngZone: NgZone) {
        this.setupBroadcastListener();

        if (this.isAuthenticated()) {
            const user = this.getUser();
            // if (user?.expiresIn) {
            //     this.sessionTimeout = user.expiresIn;
            // }
            this.resetActivityTimer(false); // Don't broadcast initial reset
            this.startSessionTimer();
        }
    }

    private setupBroadcastListener() {
        this.authChannel.onmessage = (event) => {
            this.ngZone.run(() => {
                const message = event.data;
                console.log('AuthService received message:', message.type);

                switch (message.type) {
                    case 'LOGIN':
                        this.handleRemoteLogin(message.payload);
                        break;
                    case 'LOGOUT':
                        this.handleRemoteLogout();
                        break;
                    case 'ACTIVITY':
                        this.resetActivityTimer(false);
                        break;
                }
            });
        };
    }

    register(registerRequest: RegisterRequest): Observable<string> {
        return this.http.post(this.apiUrl + '/register', registerRequest, { responseType: 'text' });
    }

    login(loginRequest: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(this.apiUrl + '/login', loginRequest).pipe(
            timeout(3000),
            tap(response => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response));
                // if (response.expiresIn) {
                //     this.sessionTimeout = response.expiresIn;
                // }

                this.authChannel.postMessage({
                    type: 'LOGIN',
                    payload: { expiresIn: response.expiresIn }
                });

                this.resetActivityTimer(false); // Don't broadcast as we just sent LOGIN
                this.startSessionTimer();
            })
        );
    }

    logout(broadcast: boolean = true): void {
        this.stopSessionTimer();
        console.log('Logging out...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        if (broadcast) {
            this.authChannel.postMessage({ type: 'LOGOUT' });
        }

        // Use window.location.href to ensure full reload and clear any state
        window.location.href = '/login';
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getUser(): AuthResponse | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        try {
            const decoded = jwtDecode<JwtPayload>(token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp && decoded.exp < currentTime) {
                this.logout(false); // Don't broadcast if it's just a local check
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    getRole(): string | null {
        const token = this.getToken();
        if (!token) return null;
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            return decoded.role || decoded.authority || null;
        } catch (e) {
            return null;
        }
    }

    isAdmin(): boolean {
        const user = this.getUser();
        return user?.role === 'ADMIN';
    }

    resetActivityTimer(broadcast: boolean = true): void {
        if (this.lastActivityTime === 0) {
            console.log('Activity detected. Timer started.');
        }
        this.lastActivityTime = Date.now();
        this.extendPromptShown = false;
        this.showExtendPrompt$.next(false);

        if (broadcast) {
            this.authChannel.postMessage({ type: 'ACTIVITY' });
        }
    }

    extendSession(): void {
        // extending session is basically just activity
        this.resetActivityTimer(true);
    }

    private startSessionTimer() {
        this.stopSessionTimer();
        this.extendPromptShown = false;

        if (!this.isAuthenticated()) return;

        this.timerSubscription = interval(1000).subscribe(() => {
            const now = Date.now();
            const timeSinceLastActivity = now - this.lastActivityTime;
            const timeLeft = this.sessionTimeout - timeSinceLastActivity;

            if (timeLeft <= 0) {
                console.log('Timer expired. TimeLeft:', timeLeft);
                this.logout(true);
            } else {
                const totalSeconds = Math.floor(timeLeft / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                this.timeRemaining$.next(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);

                if (timeLeft <= this.EXTEND_PROMPT_THRESHOLD && !this.extendPromptShown) {
                    this.extendPromptShown = true;
                    this.showExtendPrompt$.next(true);
                }
            }
        });
    }

    private stopSessionTimer() {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
            this.timerSubscription = null;
        }
        this.timeRemaining$.next('');
        this.showExtendPrompt$.next(false);
        this.extendPromptShown = false;
    }

    private handleRemoteLogin(payload: any) {
        // if (payload?.expiresIn) {
        //     this.sessionTimeout = payload.expiresIn;
        // }
        this.resetActivityTimer(false);
        this.startSessionTimer();
    }

    private handleRemoteLogout() {
        this.stopSessionTimer();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
}
