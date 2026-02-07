import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../shared-lib/src/services/auth.service';
import { ToastService } from '../../../../shared-lib/src/services/toast.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    registerForm: FormGroup;
    errorMessage: string = '';
    isLoading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private toastService: ToastService
    ) {
        this.registerForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            role: ['USER']
        });
    }

    onSubmit() {
        if (this.registerForm.valid) {
            this.isLoading = true;
            this.authService.register(this.registerForm.value).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.toastService.show('Registration successful! Please login.', 'success');
                    this.router.navigate(['/login']);
                },
                error: (err) => {
                    this.isLoading = false;
                    if (err.status === 409) {
                        this.errorMessage = 'Email already exists';
                        this.toastService.show('Email already exists', 'error');
                    } else {
                        this.errorMessage = 'Registration failed';
                        this.toastService.show('Registration failed', 'error');
                    }
                }
            });
        }
    }
}

