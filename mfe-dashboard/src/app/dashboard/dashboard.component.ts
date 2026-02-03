import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../../../shared-lib/src/services/project.service';
import { TaskService } from '../../../../shared-lib/src/services/task.service';
import { AuthService } from '../../../../shared-lib/src/services/auth.service';
import { Project } from '../../../../shared-lib/src/models/project.model';
import { Task } from '../../../../shared-lib/src/models/task.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
    projects: Project[] = [];
    loading: boolean = true;
    isAdmin: boolean = false;
    userName: string = '';
    currentUserEmail: string = '';

    myTasksCount: number = 0;
    dueSoonDisplay: string | number = 0;
    dueSoonCount: number = 0;
    recentTasks: Task[] = [];
    today: Date = new Date();

    constructor(
        private projectService: ProjectService,
        private taskService: TaskService,
        private authService: AuthService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.isAdmin = this.authService.isAdmin();
        const user = this.authService.getUser();
        this.userName = user ? user.name : 'User';
        this.currentUserEmail = user ? user.email : '';

        this.loadProjects();
        this.loadMyTasks();
    }

    loadProjects() {
        this.loading = true;
        this.projectService.getProjects().subscribe({
            next: (data) => {
                this.projects = data;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    loadMyTasks() {
        this.taskService.getAssignedTasks().subscribe({
            next: (tasks: Task[]) => {
                this.myTasksCount = tasks.length;
                this.recentTasks = tasks.slice(0, 5);

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const nextWeek = new Date();
                nextWeek.setDate(today.getDate() + 7);

                const dueSoonTasks = tasks.filter((t: Task) => {
                    if (!t.dueDate) return false;

                    const statusName = t.status?.name?.toUpperCase();
                    if (statusName !== 'TO_DO' && statusName !== 'IN_PROGRESS') {
                        return false;
                    }

                    const dueDate = new Date(t.dueDate);
                    return dueDate <= nextWeek;
                });

                if (dueSoonTasks.length > 0) {
                    dueSoonTasks.sort((a, b) => {
                        return new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime();
                    });
                    const earliestTask = dueSoonTasks[0];
                    const date = new Date(earliestTask.dueDate!);
                    this.dueSoonDisplay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    this.dueSoonCount = dueSoonTasks.length;
                } else {
                    this.dueSoonDisplay = 0;
                    this.dueSoonCount = 0;
                }

                this.cdr.detectChanges();
            },
            error: () => { }
        });
    }
}
