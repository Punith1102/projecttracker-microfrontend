import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../../shared-lib/src/services/task.service';
import { Task } from '../../../../shared-lib/src/models/task.model';

@Component({
    selector: 'app-my-tasks',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './my-tasks.component.html',
    styleUrl: './my-tasks.component.css'
})
export class MyTasksComponent implements OnInit {
    tasks: Task[] = [];
    loading: boolean = true;

    constructor(
        private taskService: TaskService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadTasks();
    }

    loadTasks() {
        console.log('DEBUG: Loading assigned tasks...');
        this.loading = true;
        this.taskService.getAssignedTasks().subscribe({
            next: (data) => {
                console.log('DEBUG: Received assigned tasks:', data);
                console.log('DEBUG: Number of tasks:', data.length);
                this.tasks = data;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    updateStatus(task: Task) {
        const newStatusId = +task.status.statusId;
        let newStatusName = 'TO_DO';
        if (newStatusId === 2) newStatusName = 'IN_PROGRESS';
        if (newStatusId === 3) newStatusName = 'DONE';

        this.taskService.updateTaskStatus(task.taskId, newStatusId).subscribe({
            next: () => {
                task.status.name = newStatusName;
                this.cdr.detectChanges();
            },
            error: () => { }
        });
    }
}
