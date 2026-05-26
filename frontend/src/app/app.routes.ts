import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Users } from './components/users/users';
import { Articles } from './components/articles/articles';
import { Transactions } from './components/transactions/transactions';
import { ArticleForm } from './components/article-form/article-form';
import { Home } from './components/home/home';
import { AdminGuard } from './services/auth/admin-guard';
import { ArticleView } from './components/article-view/article-view';
import { UserPurchase } from './components/user-purchase/user-purchase';
import { UserGuard } from './services/auth/user-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'dashboard', component: Dashboard, canActivate: [AdminGuard] },
    { path: 'users', component: Users, canActivate: [AdminGuard] },
    { path: 'articles', component: Articles, canActivate: [AdminGuard] },
    { path: 'transactions', component: Transactions, canActivate: [AdminGuard] },
    { path: 'articles/create', component: ArticleForm, canActivate: [AdminGuard] },
    { path: 'articles/edit/:slug', component: ArticleForm, canActivate: [AdminGuard] },
    { path: 'article/view/:slug', component: ArticleView },
    { path: 'home', component: Home},
    { path: 'purchase',  component: UserPurchase, canActivate: [UserGuard]}
];
