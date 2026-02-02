import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private apiUrl = `${environment.apiUrl}/projects`;

    constructor(private http: HttpClient) { }

    getProjects(): Observable<Project[]> {
        return this.http.get<any[]>(this.apiUrl).pipe(
            map(projects => projects.map(p => ({
                ...p,
                projectId: p.projectId || p.projectID
            })))
        );
    }

    getProject(id: number): Observable<Project> {
        return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
            map(p => ({
                ...p,
                projectId: p.projectId || p.projectID
            }))
        );
    }

    createProject(project: Project): Observable<Project> {
        return this.http.post<Project>(this.apiUrl, project);
    }

    createTask(projectId: number, task: Task): Observable<Task> {
        return this.http.post<Task>(`${this.apiUrl}/${projectId}/tasks`, task);
    }

    deleteProject(projectId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${projectId}`);
    }

    updateProject(projectId: number, project: Partial<Project>): Observable<Project> {
        return this.http.put<Project>(`${this.apiUrl}/${projectId}`, project);
    }
}
