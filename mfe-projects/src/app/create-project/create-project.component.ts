import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../../shared-lib/src/services/project.service';
import { UserService } from '../../../../shared-lib/src/services/user.service';
import { AuthService } from '../../../../shared-lib/src/services/auth.service';
import { ToastService } from '../../../../shared-lib/src/services/toast.service';
import { User } from '../../../../shared-lib/src/models/auth.models';

@Component({
    selector: 'app-create-project',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './create-project.component.html',
    styleUrl: './create-project.component.css'
})
export class CreateProjectComponent implements OnInit {
    users: User[] = [];
    createProjectForm: FormGroup;
    isLoading: boolean = false;
    isAdmin: boolean = false;

    constructor(
        private projectService: ProjectService,
        private userService: UserService,
        private authService: AuthService,
        private toastService: ToastService,
        private fb: FormBuilder,
        private router: Router
    ) {
        this.createProjectForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.isAdmin = this.authService.isAdmin();
        this.loadUsers();
    }

    loadUsers() {
        this.userService.getAllUsers().subscribe({
            next: (data) => {
                const currentUser = this.authService.getUser();
                this.users = data.filter(u => u.email !== currentUser?.email);
            },
            error: () => { }
        });
    }

    onSubmit() {
        if (this.createProjectForm.valid) {
            this.isLoading = true;
            this.projectService.createProject(this.createProjectForm.value).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.toastService.show('Project created successfully!', 'success');
                    this.router.navigate(['/dashboard']);
                },
                error: (err) => {
                    this.isLoading = false;
                    console.error('Create Project Failed:', err);
                    this.toastService.show('Failed to create project', 'error');
                }
            });
        }
    }
}

