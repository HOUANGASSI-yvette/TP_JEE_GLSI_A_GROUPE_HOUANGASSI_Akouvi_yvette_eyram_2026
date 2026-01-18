import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BankService, Account } from '../../../core/services/bank.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-accounts-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-10 animate-fade-in-up pb-10">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div class="space-y-2">
           <h2 class="text-3xl font-bold text-slate-900 font-primary">Mes Comptes</h2>
           <p class="text-slate-500 font-medium">Consultez et gérez vos actifs financiers en toute sécurité.</p>
        </div>
        
        <a routerLink="/dashboard/accounts/new" 
           class="group flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-lg font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 transform hover:-translate-y-0.5">
          <svg class="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Ouvrir un compte
        </a>
      </div>

      <!-- Stats Summary (Quick View) -->
      <div *ngIf="!loading && accounts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-8 text-white shadow-xl relative overflow-hidden group border border-slate-700">
              <div class="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl group-hover:bg-amber-500/30 transition-colors"></div>
              <p class="text-slate-400 font-bold uppercase tracking-widest text-xs mb-3">Total des avoirs</p>
              <h3 class="text-4xl font-bold font-primary">{{ getTotalBalance() | number:'1.0-0' }} <span class="text-amber-500 text-lg">FCFA</span></h3>
              <div class="mt-8 flex items-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-400/10 inline-flex px-3 py-1 rounded-lg border border-emerald-400/20">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                  <span>Actifs Sécurisés</span>
              </div>
          </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div *ngFor="let i of [1,2,3]" class="h-64 rounded-2xl bg-slate-100 animate-pulse"></div>
      </div>

      <!-- Accounts Grid -->
      <div *ngIf="!loading && accounts.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div *ngFor="let acc of accounts" 
             class="group relative bg-white rounded-lg p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-8">
              <div class="w-14 h-14 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-amber-400 transition-colors duration-300 shadow-sm">
                <svg *ngIf="acc.accountType === 'CHECKING'" class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <svg *ngIf="acc.accountType === 'SAVINGS'" class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div [ngClass]="acc.accountType === 'SAVINGS' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-blue-50 text-blue-700 border-blue-100'" 
                   class="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border">
                {{ acc.accountType === 'CHECKING' ? 'Compte Courant' : 'Compte Épargne' }}
              </div>
            </div>

            <div class="space-y-3 mb-8">
              <p class="text-3xl font-bold text-slate-900 font-primary tracking-tight">
                {{ acc.balance | number:'1.2-2' }} <span class="text-sm text-slate-400 font-medium">FCFA</span>
              </p>
              <div class="flex items-center gap-2">
                 <span class="text-[10px] uppercase font-bold text-slate-400 tracking-widest">IBAN</span>
                 <p class="font-mono text-xs text-slate-600 font-medium bg-slate-50 px-2 py-1 rounded border border-slate-100">
                   {{ acc.accountNumber }}
                 </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <a [routerLink]="['/dashboard/transactions/transfer']" 
                 [queryParams]="{ from: acc.id }" 
                 class="flex-1 py-3 text-center bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10">
                Virement
              </a>
              <button class="flex-1 py-3 text-center border border-slate-200 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 hover:text-amber-600 hover:border-amber-200 transition-all">
                Détails
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && accounts.length === 0" class="bg-white rounded-xl p-16 text-center border border-slate-200 shadow-sm">
        <div class="mx-auto w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 text-slate-300">
          <svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-slate-900 font-primary">Aucun compte actif</h3>
        <p class="text-slate-500 mt-2 mb-8 max-w-sm mx-auto">Votre portefeuille est vide. Créez votre premier compte pour commencer à gérer vos finances.</p>
        <a routerLink="/dashboard/accounts/new" class="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-8 py-4 rounded-lg font-bold hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 transform hover:-translate-y-0.5">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Ouvrir un compte
        </a>
      </div>
    </div>
  `
})
export class AccountsListComponent implements OnInit {
  private bankService = inject(BankService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  accounts: Account[] = [];
  loading = true;

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.fetchAccounts(userId);
    } else {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  fetchAccounts(userId: number): void {
    this.bankService.getAccountsByClient(userId).subscribe({
      next: (data: Account[]) => {
        console.log('Accounts list response:', data);
        this.accounts = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error fetching accounts', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getTotalBalance(): number {
    return this.accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  }
}
