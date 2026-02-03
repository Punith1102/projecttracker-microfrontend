import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ProjectService } from '../../../../shared-lib/src/services/project.service';
import { TaskService } from '../../../../shared-lib/src/services/task.service';
import { AuthService } from '../../../../shared-lib/src/services/auth.service';
import { Project } from '../../../../shared-lib/src/models/project.model';
import { Task } from '../../../../shared-lib/src/models/task.model';
import { UserService } from '../../../../shared-lib/src/services/user.service';
import { ToastService } from '../../../../shared-lib/src/services/toast.service';
import { User } from '../../../../shared-lib/src/models/auth.models';

@Component({
    selector: 'app-project-detail',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DragDropModule, FormsModule],
    templateUrl: './project-detail.component.html',
    styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent implements OnInit {
    project: Project | null = null;
    todoTasks: Task[] = [];
    inProgressTasks: Task[] = [];
    doneTasks: Task[] = [];

    loading: boolean = true;
    showCreateTaskForm: boolean = false;
    createTaskForm: FormGroup;
    projectId: number = 0;
    isAdmin: boolean = false;

    currentUserEmail: string = '';

    users: User[] = [];

    showEditModal: boolean = false;
    editingTask: Partial<Task> = {};

    showEditProjectModal: boolean = false;
    editingProject: Partial<Project> = {};

    constructor(
        private route: ActivatedRoute,
        private projectService: ProjectService,
        private taskService: TaskService,
        private authService: AuthService,
        private userService: UserService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private toastService: ToastService
    ) {
        this.createTaskForm = this.fb.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            dueDate: ['', [Validators.required, this.futureDateValidator]],
            priority: ['Medium'],
            assignedTo: [null]
        });
    }

    ngOnInit(): void {
        this.isAdmin = this.authService.isAdmin();

        const user = this.authService.getUser();
        this.currentUserEmail = user ? user.email : '';

        this.loadUsers();

        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            const parsedId = +id;
            if (!isNaN(parsedId)) {
                this.projectId = parsedId;
                this.loadProjectDetails(this.projectId);
            } else {
                console.error('Invalid project ID:', id);
                this.loading = false;
            }
        }
    }

    loadUsers() {
        this.userService.getAllUsers().subscribe({
            next: (data) => {
                this.users = data;
                if (this.users.length === 0) {
                    this.toastService.show('Warning: No users found', 'warning');
                }
            },
            error: (err) => { }
        });
    }

    loadProjectDetails(id: number) {
        this.loading = true;
        this.projectService.getProject(id).subscribe({
            next: (project) => {
                this.project = project;
                const tasks = (project as any).tasks || [];
                this.organizeTasks(tasks);
                this.loading = false;
                this.cdr.markForCheck();
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    organizeTasks(tasks: Task[]) {
        if (!tasks) return;
        this.todoTasks = tasks.filter(t => t.status?.name === 'TO_DO');
        this.inProgressTasks = tasks.filter(t => t.status?.name === 'IN_PROGRESS');
        this.doneTasks = tasks.filter(t => t.status?.name === 'DONE');
    }

    drop(event: CdkDragDrop<Task[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );

            const task = event.container.data[event.currentIndex];
            let newStatusId = 1;
            let newStatusName = 'TO_DO';

            if (event.container.id === 'inProgressList') {
                newStatusId = 2;
                newStatusName = 'IN_PROGRESS';
            } else if (event.container.id === 'doneList') {
                newStatusId = 3;
                newStatusName = 'DONE';
            }

            this.taskService.updateTaskStatus(task.taskId, newStatusId).subscribe({
                next: () => {
                    task.status = { statusId: newStatusId, name: newStatusName };
                },
                error: () => { }
            });
        }
    }

    toggleCreateTaskForm() {
        this.showCreateTaskForm = !this.showCreateTaskForm;
    }

    onSubmitTask() {
        if (this.createTaskForm.valid && this.projectId) {
            const taskData = {
                ...this.createTaskForm.value,
                status: { statusId: 1, name: 'TO_DO' }
            };

            this.projectService.createTask(this.projectId, taskData).subscribe({
                next: (newTask) => {
                    this.toastService.show('Task created successfully!', 'success');
                    this.todoTasks.push(newTask);
                    this.showCreateTaskForm = false;
                    this.createTaskForm.reset({ priority: 'Medium' });
                    this.cdr.markForCheck();
                },
                error: () => { }
            });
        }
    }

    canDelete(task: Task): boolean {
        return this.isAdmin ||
            (task.assignedTo?.email === this.currentUserEmail) ||
            (this.project?.createdBy?.email === this.currentUserEmail);
    }

    editTask(task: Task) {
        this.editingTask = { ...task };
        this.showEditModal = true;
    }

    closeEditModal() {
        this.showEditModal = false;
        this.editingTask = {};
    }

    saveTaskChanges() {
        if (!this.editingTask.title || !this.editingTask.description) {
            this.toastService.show('Please fill in all fields', 'warning');
            return;
        }

        if (!this.editingTask.taskId) return;

        this.taskService.updateTask(this.editingTask.taskId, this.editingTask as Task).subscribe({
            next: (updatedTask) => {
                const updateList = (list: Task[]) => {
                    const index = list.findIndex(t => t.taskId === this.editingTask.taskId);
                    if (index !== -1) {
                        list[index] = updatedTask;
                    }
                };
                updateList(this.todoTasks);
                updateList(this.inProgressTasks);
                updateList(this.doneTasks);
                this.closeEditModal();
                this.toastService.show('Task updated successfully', 'success');
            },
            error: () => { }
        });
    }

    deleteTask(taskId: number) {
        console.log('Attempting to delete task with ID:', taskId);
        this.taskService.deleteTask(taskId).subscribe({
            next: () => {
                this.toastService.show('Task deleted successfully', 'success');

                const idStr = String(taskId);

                this.todoTasks = this.todoTasks.filter(t => String(t.taskId) !== idStr);
                this.inProgressTasks = this.inProgressTasks.filter(t => String(t.taskId) !== idStr);
                this.doneTasks = this.doneTasks.filter(t => String(t.taskId) !== idStr);

                if (this.project && (this.project as any).tasks) {
                    (this.project as any).tasks = (this.project as any).tasks.filter((t: Task) => String(t.taskId) !== idStr);
                }

                this.cdr.detectChanges();
            },
            error: () => { }
        });
    }

    canEditProject(): boolean {
        return this.isAdmin || (this.project?.createdBy?.email === this.currentUserEmail);
    }

    canDeleteProject(): boolean {
        return this.isAdmin || (this.project?.createdBy?.email === this.currentUserEmail);
    }

    deleteProject() {
        this.projectService.deleteProject(this.projectId).subscribe({
            next: () => {
                this.toastService.show('Project deleted successfully', 'success');
                this.toastService.show('Redirecting...', 'info');
                setTimeout(() => window.location.href = '/dashboard', 1000);
            },
            error: () => { }
        });
    }

    openEditProjectModal() {
        if (this.project) {
            this.editingProject = { ...this.project };
            this.showEditProjectModal = true;
        }
    }

    closeEditProjectModal() {
        this.showEditProjectModal = false;
        this.editingProject = {};
    }

    saveProjectChanges() {
        if (!this.editingProject.name || !this.editingProject.description) {
            this.toastService.show('Name and Description are required', 'warning');
            return;
        }

        this.projectService.updateProject(this.projectId, this.editingProject).subscribe({
            next: (updatedProject) => {
                this.project = updatedProject;
                this.toastService.show('Project updated successfully', 'success');
                this.closeEditProjectModal();
            },
            error: () => { }
        });
    }

    futureDateValidator(control: AbstractControl) {
        if (!control.value) return null;
        const selectedDate = new Date(control.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today ? null : { pastDate: true };
    }

    compareUsers(u1: User | null, u2: User | null): boolean {
        if (!u1 && !u2) return true;
        if (!u1 || !u2) return false;
        return u1.userId === u2.userId;
    }
}
