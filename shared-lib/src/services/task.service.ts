import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = `${environment.apiUrl}/tasks`;

    constructor(private http: HttpClient) { }

    getAssignedTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(`${this.apiUrl}/assigned`);
    }

    updateTaskStatus(taskId: number, statusId: number): Observable<Task> {
        return this.http.put<Task>(`${this.apiUrl}/${taskId}/status`, { statusId });
    }

    updateTask(taskId: number, task: Task): Observable<Task> {
        return this.http.put<Task>(`${this.apiUrl}/${taskId}`, task);
    }

    unassignUser(taskId: number): Observable<Task> {
        return this.http.put<Task>(`${this.apiUrl}/${taskId}/unassign`, {});
    }

    deleteTask(taskId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${taskId}`, { responseType: 'text' });
    }
}
