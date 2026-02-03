import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../../shared-lib/src/services/project.service';
import { UserService } from '../../../../shared-lib/src/services/user.service';
import { AuthService } from '../../../../shared-lib/src/services/auth.service';
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
            this.projectService.createProject(this.createProjectForm.value).subscribe({
                next: () => {
                    this.router.navigate(['/dashboard']);
                },
                error: (err) => {
                    console.error('Create Project Failed:', err);
                    alert('Failed to create project. Check console for details. (Likely 401 Unauthorized if running in isolation)');
                }
            });
        }
    }
}
