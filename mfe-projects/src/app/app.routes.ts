import { Routes } from '@angular/router';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';

export const routes: Routes = [
    { path: '', component: CreateProjectComponent }, // Default route - might want to change this if there's a list view in mfe-projects, but usually projects list is in dashboard or a separate list component. 
    // Wait, mfe-projects should probably have a list view if navigated to /projects? 
    // In dashboard, we link to /projects for "View All".
    // Let's check if there is a project list component.
    // In dashboard.component.html: <a routerLink="/projects" class="view-link">View All</a>.
    // In original app routes (Step 10): 
    // { path: 'projects', component: CreateProjectComponent, canActivate: [authGuard] }, <- Wait, clicking "Projects" goes to CreateProject?
    // { path: 'projects/:id', component: ProjectDetailComponent, canActivate: [authGuard] },
    // The original app treats /projects as CreateProjectComponent? That seems odd but I will follow the original structure for now.
    // Let me double check app.routes.ts from Step 10.

    { path: '', component: CreateProjectComponent },
    { path: ':id', component: ProjectDetailComponent }
];
