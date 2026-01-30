import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Users } from './components/users/users';
import { Articles } from './components/articles/articles';
import { Transactions } from './components/transactions/transactions';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: Dashboard },
    { path: 'users', component: Users },
    { path: 'articles', component: Articles },
    { path: 'transactions', component: Transactions}

];
