
import { Routes } from '@angular/router';

import { Home } from './Component/home/home';
import { Login } from './Component/login/login';
import { Register } from './Component/register/register';
import { Dashboard } from './Component/dashboard/dashboard';
import { Transactions } from './Component/transactions/transactions';
import { Reports } from './Component/reports/reports';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [

    { path: '', component: Home },

    { path: 'home', component: Home },

    {
        path: 'login',
        component: Login
    },

    {
        path: 'register',
        component: Register,
        title: 'Register — Expense Tracker'
    },

    {
        path: 'dashboard',
        component: Dashboard,
        title: 'Dashboard — Expense Tracker',
        canActivate: [authGuard]
    },

    {
        path: 'transactions/:userId',
        component: Transactions,
        title: 'Transactions — Expense Tracker',
        canActivate: [authGuard]
    },

    {
        path: 'reports/:userId',
        component: Reports,
        title: 'Reports — Expense Tracker',
        canActivate: [authGuard]
    },

    { path: '**', redirectTo: '' }

];
