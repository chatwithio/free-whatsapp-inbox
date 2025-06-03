import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./inbox/inbox.component').then(m => m.InboxComponent)
    }
];
