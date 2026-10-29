import { Routes } from '@angular/router';
import { Home } from './Component/home/home';
import { Login } from './Component/login/login';
import { Register } from './Component/register/register';
import { Dashboard } from './Component/dashboard/dashboard';
import { Transactions } from './Component/transactions/transactions';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'home', component: Home },


    {
        path: 'login',
        component: Login,

    },
    {
        path: 'register',
        component: Register,
        title: 'Register — Expense Tracker'
    },

    {
        path: 'dashboard',
        component: Dashboard,
        // canActivate: [authGuard],
        title: 'Dashboard — Expense Tracker'
    },
    {
        path: 'transactions/:userId',
        component: Transactions,
        // canActivate: [authGuard],
        title: 'Transactions — Expense Tracker'
    },



    { path: '**', redirectTo: '' }

];
