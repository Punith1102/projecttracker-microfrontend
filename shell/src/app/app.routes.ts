import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => loadRemoteModule({
            type: 'module',
            remoteEntry: 'http://localhost:4201/remoteEntry.js',
            exposedModule: './Routes'
        }).then(m => m.routes)
    },
    {
        path: 'dashboard',
        loadChildren: () => loadRemoteModule({
            type: 'module',
            remoteEntry: 'http://localhost:4202/remoteEntry.js',
            exposedModule: './Routes'
        }).then(m => m.routes)
    },
    {
        path: 'projects',
        loadChildren: () => loadRemoteModule({
            type: 'module',
            remoteEntry: 'http://localhost:4203/remoteEntry.js',
            exposedModule: './Routes'
        }).then(m => m.routes)
    },
    {
        path: 'admin',
        loadChildren: () => loadRemoteModule({
            type: 'module',
            remoteEntry: 'http://localhost:4204/remoteEntry.js',
            exposedModule: './Routes'
        }).then(m => m.routes)
    },
    {
        path: 'my-tasks',
        loadChildren: () => loadRemoteModule({
            type: 'module',
            remoteEntry: 'http://localhost:4205/remoteEntry.js',
            exposedModule: './Routes'
        }).then(m => m.routes)
    }
];
