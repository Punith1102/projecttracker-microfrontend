import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
    showUserMenu = false;
    remainingTime: string = '';
    showExtendPrompt = false;
    private subscriptions = new Subscription();

    constructor(
        public authService: AuthService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.subscriptions.add(
            this.authService.timeRemaining$.subscribe(time => {
                this.remainingTime = time;
                this.cdr.detectChanges();
            })
        );

        this.subscriptions.add(
            this.authService.showExtendPrompt$.subscribe(show => {
                this.showExtendPrompt = show;
                this.cdr.detectChanges();
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    toggleUserMenu() {
        this.showUserMenu = !this.showUserMenu;
    }

    getUserName(): string {
        const user = this.authService.getUser();
        return user?.name || 'User';
    }

    getUserInitials(): string {
        const name = this.getUserName();
        return name.charAt(0).toUpperCase();
    }

    extendSession() {
        this.authService.extendSession();
    }

    logout() {
        this.showUserMenu = false;
        this.authService.logout();
    }
}
