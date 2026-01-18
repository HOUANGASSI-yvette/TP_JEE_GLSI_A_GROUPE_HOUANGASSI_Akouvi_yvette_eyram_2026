import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'clients',
        loadComponent: () => import('./components/clients/client-list/client-list.component').then(m => m.ClientListComponent)
      },
      {
        path: 'clients/new',
        loadComponent: () => import('./components/clients/client-form/client-form.component').then(m => m.ClientFormComponent)
      },
      {
        path: 'clients/:id/edit',
        loadComponent: () => import('./components/clients/client-form/client-form.component').then(m => m.ClientFormComponent)
      },
      {
        path: 'comptes',
        loadComponent: () => import('./components/comptes/compte-list/compte-list.component').then(m => m.CompteListComponent)
      },
      {
        path: 'comptes/new',
        loadComponent: () => import('./components/comptes/compte-form/compte-form.component').then(m => m.CompteFormComponent)
      },
      {
        path: 'comptes/:id/edit',
        loadComponent: () => import('./components/comptes/compte-form/compte-form.component').then(m => m.CompteFormComponent)
      },
      {
        path: 'transactions',
        loadComponent: () => import('./components/transactions/transaction-list/transaction-list.component').then(m => m.TransactionListComponent)
      },
      {
        path: 'transactions/depot',
        loadComponent: () => import('./components/transactions/transaction-depot/transaction-depot.component').then(m => m.TransactionDepotComponent)
      },
      {
        path: 'transactions/retrait',
        loadComponent: () => import('./components/transactions/transaction-retrait/transaction-retrait.component').then(m => m.TransactionRetraitComponent)
      },
      {
        path: 'transactions/transfert',
        loadComponent: () => import('./components/transactions/transaction-transfert/transaction-transfert.component').then(m => m.TransactionTransfertComponent)
      }
    ]
  }
];
