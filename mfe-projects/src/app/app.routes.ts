import { Routes } from '@angular/router';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';

export const routes: Routes = [
    { path: '', component: CreateProjectComponent }, 
    
    
    
    
    
    
    
    
    

    { path: '', component: CreateProjectComponent },
    { path: ':id', component: ProjectDetailComponent }
];
