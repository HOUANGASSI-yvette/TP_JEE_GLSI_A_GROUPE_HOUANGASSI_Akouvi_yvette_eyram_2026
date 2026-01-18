import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BankService, Client, Account, Transaction } from '../../../core/services/bank.service';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-8 animate-fade-in-up pb-10">
      <!-- Welcome Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div class="space-y-2">
          <h2 class="text-3xl font-extrabold text-slate-900 font-primary tracking-tight">Performance Bancaire</h2>
          <p class="text-slate-500 font-medium tracking-wide">Vue analytique et supervision des flux en temps réel.</p>
        </div>
        
        <div class="flex items-center gap-4">
           <div class="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100 flex items-center gap-3">
              <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Status: Connecté</span>
           </div>
           <button (click)="refreshData()" class="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5" [class.animate-spin]="loading">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
           </button>
        </div>
      </div>

      <!-- Analytics KPI Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Clients Card -->
        <div class="bg-white p-6 rounded-lg shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative">
          <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 text-blue-600">
               <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-3.833-6.233 4.125 4.125 0 00-3.833 6.233z" />
             </svg>
          </div>
          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-4">
               <div class="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-3.833-6.233" />
                  </svg>
               </div>
               <span class="text-[9px] font-black text-blue-600/50 uppercase tracking-widest">Base Clients</span>
            </div>
            <div class="text-3xl font-black text-slate-900 mb-2">{{ stats.totalClients }}</div>
            <div class="flex items-center gap-1.5">
               <span class="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
               <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">ce mois</span>
            </div>
          </div>
        </div>

        <!-- Accounts Card -->
        <div class="bg-white p-6 rounded-lg shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative">
          <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 text-purple-600">
               <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6" />
             </svg>
          </div>
          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-4">
               <div class="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12H3m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6" />
                  </svg>
               </div>
               <span class="text-[9px] font-black text-purple-600/50 uppercase tracking-widest">Portefeuille</span>
            </div>
            <div class="text-3xl font-black text-slate-900 mb-2">{{ stats.totalAccounts }}</div>
            <div class="flex items-center gap-1.5">
               <span class="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">+5.4%</span>
               <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">nouveaux</span>
            </div>
          </div>
        </div>

        <!-- Liquidity Card -->
        <div class="bg-slate-900 p-6 rounded-lg shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-4 opacity-10">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 text-white">
               <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6" />
             </svg>
          </div>
          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-4">
               <div class="w-9 h-9 rounded-lg bg-white/10 text-amber-400 flex items-center justify-center backdrop-blur-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6" />
                  </svg>
               </div>
               <span class="text-[9px] font-black text-white/40 uppercase tracking-widest">Liquidité</span>
            </div>
            <div class="text-xl font-black text-white mb-2">{{ stats.totalLiquidity | number:'1.0-0' }} <span class="text-[9px] font-bold text-amber-500">FCFA</span></div>
            <div class="flex items-center gap-1.5">
               <span class="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">Record</span>
               <span class="text-[9px] font-medium text-slate-400">Croissance stable</span>
            </div>
          </div>
        </div>

        <!-- Volume Card -->
        <div class="bg-white p-6 rounded-lg shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative">
          <div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-emerald-50 to-transparent opacity-50"></div>
          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-4">
               <div class="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5" />
                  </svg>
               </div>
               <span class="text-[9px] font-black text-emerald-600/50 uppercase tracking-widest">Activités</span>
            </div>
            <div class="text-3xl font-black text-slate-900 mb-2">{{ stats.totalTransactions }}</div>
            <div class="flex items-center gap-1.5">
               <div class="flex items-end gap-0.5 h-3">
                  <div class="w-1 bg-emerald-200 h-1 rounded-full"></div>
                  <div class="w-1 bg-emerald-400 h-2 rounded-full"></div>
                  <div class="w-1 bg-emerald-600 h-3 rounded-full"></div>
               </div>
               <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Opérations validées</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Activity Feed & Clients -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Recent Transactions -->
          <div class="space-y-6">
             <div class="flex justify-between items-end">
                <h3 class="text-xl font-extrabold text-slate-900 font-primary">Opérations Récentes</h3>
                <a routerLink="/dashboard/admin/transactions" class="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">Voir Tout</a>
             </div>

             <div class="bg-white rounded-lg shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden px-2">
                <table class="w-full text-left border-collapse" *ngIf="recentTransactions.length > 0; else noTransactionsTemplate">
                  <thead>
                    <tr class="bg-white">
                      <th class="px-5 py-4 text-[8px] font-black text-slate-400 uppercase tracking-[0.25em]">Détails</th>
                      <th class="px-5 py-4 text-[8px] font-black text-slate-400 uppercase tracking-[0.25em]">Compte</th>
                      <th class="px-5 py-4 text-[8px] font-black text-slate-400 uppercase tracking-[0.25em] text-right">Somme</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr *ngFor="let tx of recentTransactions" class="hover:bg-slate-50/50 transition-colors group">
                      <td class="px-6 py-5">
                        <div class="flex items-center gap-4">
                          <div [class]="'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ' + getTxColorClass(tx.transactionType)">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                              <path *ngIf="tx.transactionType === 'CREDIT' || tx.transactionType === 'DEPOSIT'" stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              <path *ngIf="tx.transactionType === 'DEBIT' || tx.transactionType === 'WITHDRAWAL'" stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
                              <path *ngIf="tx.transactionType === 'TRANSFER'" stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                            </svg>
                          </div>
                          <div>
                            <div class="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{{ tx.description || tx.transactionType }}</div>
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ tx.transactionDate | date:'dd MMM, HH:mm' }}</div>
                          </div>
                        </div>
                      </td>
                       <td class="px-6 py-5">
                          <div class="text-[10px] font-mono font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100 inline-block">
                            {{ tx.sourceAccount ? tx.sourceAccount.accountNumber.slice(-8) : '••••' }}
                          </div>
                       </td>
                      <td class="px-6 py-5 text-right">
                         <div [class]="'text-sm font-black ' + (tx.amount > 0 ? 'text-emerald-600' : 'text-rose-600')">
                           {{ tx.amount | number:'1.0-0' }} FCFA
                         </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
             </div>
          </div>

          <!-- Recently Joined Clients -->
          <div class="space-y-6">
             <div class="flex justify-between items-end">
                <h3 class="text-xl font-extrabold text-slate-900 font-primary">Nouveaux Clients</h3>
                <a routerLink="/dashboard/admin/clients" class="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">Tout Gérer</a>
             </div>

             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div *ngFor="let client of recentClients" class="bg-white p-4 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                   <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold shadow-lg shadow-slate-900/10">
                         {{ client.firstName.charAt(0) }}{{ client.lastName.charAt(0) }}
                      </div>
                      <div>
                         <div class="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{{ client.firstName }} {{ client.lastName }}</div>
                         <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ client.email }}</div>
                      </div>
                   </div>
                   <div class="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[8px] font-black uppercase tracking-widest border border-emerald-100">
                      Nouveau
                   </div>
                </div>
             </div>
          </div>
        </div>

        <!-- Sidebar Activity Analytics -->
        <div class="lg:col-span-1 space-y-8">
          
          <!-- Weekly Performance Chart -->
          <div class="bg-white rounded-lg p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
             <h3 class="text-lg font-bold text-slate-900 mb-8 font-primary">Activité</h3>
             
             <div class="flex items-end justify-between h-32 gap-3 mb-8">
                <div class="flex-1 flex flex-col items-center gap-2 group">
                   <div class="w-full bg-slate-100 rounded relative overflow-hidden h-20">
                      <div class="absolute bottom-0 w-full bg-slate-900 rounded transition-all duration-1000 group-hover:bg-amber-500" [style.height]="'45%'"></div>
                   </div>
                   <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Lun</span>
                </div>
                <div class="flex-1 flex flex-col items-center gap-2 group">
                   <div class="w-full bg-slate-100 rounded relative overflow-hidden h-28">
                      <div class="absolute bottom-0 w-full bg-slate-900 rounded transition-all duration-1000 group-hover:bg-amber-500" [style.height]="'75%'"></div>
                   </div>
                   <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Mar</span>
                </div>
                <div class="flex-1 flex flex-col items-center gap-2 group">
                   <div class="w-full bg-slate-100 rounded relative overflow-hidden h-16">
                      <div class="absolute bottom-0 w-full bg-slate-900 rounded transition-all duration-1000 group-hover:bg-amber-500" [style.height]="'30%'"></div>
                   </div>
                   <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Mer</span>
                </div>
                <div class="flex-1 flex flex-col items-center gap-2 group">
                   <div class="w-full bg-slate-100 rounded relative overflow-hidden h-32">
                      <div class="absolute bottom-0 w-full bg-amber-500 rounded transition-all duration-1000" [style.height]="'100%'"></div>
                   </div>
                   <span class="text-[8px] font-black text-slate-900 uppercase tracking-widest">Jeu</span>
                </div>
                <div class="flex-1 flex flex-col items-center gap-2 group">
                   <div class="w-full bg-slate-100 rounded relative overflow-hidden h-24">
                      <div class="absolute bottom-0 w-full bg-slate-900 rounded transition-all duration-1000 group-hover:bg-amber-500" [style.height]="'60%'"></div>
                   </div>
                   <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Ven</span>
                </div>
             </div>

             <div class="bg-slate-50 p-4 rounded-lg border border-dashed border-slate-200">
                <div class="flex items-center gap-3 mb-1">
                   <div class="w-8 h-8 rounded bg-white shadow-sm flex items-center justify-center text-amber-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                      </svg>
                   </div>
                   <div>
                      <h5 class="text-[10px] font-bold text-slate-900 uppercase">Insight</h5>
                      <p class="text-[9px] text-slate-500">Virements en hausse de 12%.</p>
                   </div>
                </div>
             </div>
          </div>

          <!-- Shortcuts -->
          <div class="space-y-4">
             <h3 class="text-xl font-bold text-slate-900 font-primary">Accès Rapide</h3>
             <div class="grid grid-cols-2 gap-4">
                <a routerLink="/dashboard/admin/clients" class="p-4 bg-blue-600 rounded-lg text-white hover:shadow-xl hover:shadow-blue-600/20 transition-all flex flex-col items-center justify-center gap-3">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                   <span class="text-[9px] font-black uppercase tracking-widest">Nouveau</span>
                </a>
                <a routerLink="/dashboard/admin/deposit" class="p-4 bg-slate-900 rounded-lg text-white hover:shadow-xl hover:shadow-slate-900/20 transition-all flex flex-col items-center justify-center gap-3">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                   <span class="text-[9px] font-black uppercase tracking-widest">Dépôt</span>
                </a>
             </div>
          </div>
        </div>
      </div>
    </div>

    <ng-template #noTransactionsTemplate>
      <div class="p-20 text-center text-slate-400 font-medium bg-slate-50/10">Aucun mouvement global enregistré.</div>
    </ng-template>
  `,
  styles: [],
})
export class AdminHomeComponent implements OnInit {
  private bankService = inject(BankService);
  private cdr = inject(ChangeDetectorRef);

  clients: Client[] = [];
  accounts: Account[] = [];
  transactions: Transaction[] = [];

  recentTransactions: Transaction[] = [];
  recentClients: Client[] = [];

  stats = {
    totalClients: 0,
    totalAccounts: 0,
    totalLiquidity: 0,
    totalTransactions: 0
  };

  loading = true;

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.loading = true;
    forkJoin({
      clients: this.bankService.getAllClients(),
      accounts: this.bankService.getAllAccounts(),
      transactions: this.bankService.getAllTransactions()
    }).pipe(
      catchError(error => {
        console.error('Error fetching admin data', error);
        return of({ clients: [], accounts: [], transactions: [] });
      }),
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe(data => {
      this.clients = data.clients;
      this.accounts = data.accounts;
      this.transactions = data.transactions;

      this.stats.totalClients = this.clients.length;
      this.stats.totalAccounts = this.accounts.length;
      this.stats.totalLiquidity = this.accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
      this.stats.totalTransactions = this.transactions.length;

      this.recentTransactions = [...this.transactions]
        .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
        .slice(0, 5);

      this.recentClients = [...this.clients].slice(-4).reverse();
    });
  }

  getTxColorClass(type: string): string {
    switch (type) {
      case 'CREDIT':
      case 'DEPOSIT':
        return 'bg-emerald-50 text-emerald-600';
      case 'DEBIT':
      case 'WITHDRAWAL':
        return 'bg-rose-50 text-rose-600';
      case 'TRANSFER':
        return 'bg-blue-50 text-blue-600';
      default:
        return 'bg-slate-50 text-slate-600';
    }
  }
}
