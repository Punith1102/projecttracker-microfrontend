import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../shared-lib/src/services/auth.service';
import { ToastService } from '../../../../shared-lib/src/services/toast.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    loginForm: FormGroup;
    errorMessage: string = '';
    isLoading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private toastService: ToastService
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';

            const timeout = setTimeout(() => {
                if (this.isLoading) {
                    this.isLoading = false;
                    this.errorMessage = 'Login request timed out. Please try again.';
                    this.toastService.show('Login request timed out', 'error');
                }
            }, 5000);

            this.authService.login(this.loginForm.value).subscribe({
                next: (response) => {
                    clearTimeout(timeout);
                    this.isLoading = false;
                    this.toastService.show('Login successful', 'success');
                    this.router.navigate(['/dashboard']);
                },
                error: (err) => {
                    clearTimeout(timeout);
                    this.isLoading = false;

                    if (err.status === 401 || err.status === 403) {
                        this.errorMessage = 'Invalid email or password. Please try again.';
                    } else if (err.status === 0) {
                        this.errorMessage = 'Cannot connect to server. Please check if the backend is running.';
                    } else {
                        this.errorMessage = 'Login failed. Please try again.';
                    }
                }
            });
        }
    }
}
