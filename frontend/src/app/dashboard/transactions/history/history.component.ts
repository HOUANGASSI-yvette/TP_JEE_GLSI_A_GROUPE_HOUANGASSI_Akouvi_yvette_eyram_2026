import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankService, Transaction, Account } from '../../../core/services/bank.service';
import { AuthService } from '../../../core/services/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-transactions-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8 animate-fade-in-up pb-10">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div class="space-y-2">
           <h2 class="text-3xl font-bold text-slate-900 font-primary">Historique des Transactions</h2>
           <p class="text-slate-500 font-medium tracking-wide">Vue détaillée de vos mouvements financiers.</p>
        </div>
        
        <div class="flex gap-4">
           <button class="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-slate-50 hover:text-amber-600 hover:border-amber-200 transition-all shadow-sm">
             Exporter
           </button>
           <button class="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
             Filtrer
           </button>
        </div>
      </div>

      <!-- Transactions Card -->
      <div class="bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        
        <!-- Loading -->
        <div *ngIf="loading" class="flex h-80 items-center justify-center bg-slate-50/50">
           <div class="flex flex-col items-center gap-4">
              <div class="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500"></div>
              <p class="text-slate-400 font-bold text-sm uppercase tracking-widest">Chargement des opérations...</p>
           </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && transactions.length === 0" class="p-20 text-center bg-slate-50/30">
           <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
             <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
           </div>
           <h3 class="text-xl font-bold text-slate-900 font-primary">Aucune transaction</h3>
           <p class="text-slate-500 mt-2">Vos opérations apparaîtront ici.</p>
        </div>

        <!-- Table -->
        <div *ngIf="!loading && transactions.length > 0" class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-100">
                <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Date & Heure</th>
                <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Libellé</th>
                <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Compte</th>
                <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Statut</th>
                <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none text-right">Montant</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let tx of transactions" class="group hover:bg-slate-50/50 transition-colors duration-200 cursor-default">
                <td class="px-8 py-6">
                  <div class="flex flex-col">
                    <span class="text-sm font-bold text-slate-900">{{ tx.transactionDate | date:'dd MMM yyyy' }}</span>
                    <span class="text-xs font-bold text-slate-400">{{ tx.transactionDate | date:'HH:mm' }}</span>
                  </div>
                </td>
                
                <td class="px-8 py-6">
                  <div class="flex items-center gap-4">
                    <div [ngClass]="{
                        'bg-emerald-100 text-emerald-600': tx.transactionType === 'CREDIT' || tx.transactionType === 'DEPOSIT',
                        'bg-rose-100 text-rose-600': tx.transactionType === 'DEBIT' || tx.transactionType === 'WITHDRAWAL',
                        'bg-blue-100 text-blue-600': tx.transactionType === 'TRANSFER'
                      }" class="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                       <svg *ngIf="tx.transactionType === 'CREDIT' || tx.transactionType === 'DEPOSIT'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" class="transform rotate-180"/></svg>
                       <svg *ngIf="tx.transactionType === 'DEBIT' || tx.transactionType === 'WITHDRAWAL'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                       <svg *ngIf="tx.transactionType === 'TRANSFER'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                    </div>
                    <div>
                        <span class="font-bold text-slate-900 block">{{ tx.description || 'Transaction' }}</span>
                        <span class="text-xs text-slate-400 font-medium">{{ tx.transactionType }}</span>
                    </div>
                  </div>
                </td>

                 <td class="px-8 py-6">
                    <span class="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                      {{ tx.sourceAccount ? tx.sourceAccount.accountNumber.slice(-4) : '••••' }}
                    </span>
                 </td>

                <td class="px-8 py-6">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Validé
                  </span>
                </td>

                <td class="px-8 py-6 text-right">
                  <div class="flex flex-col items-end">
                    <span [ngClass]="tx.transactionType === 'DEBIT' ? 'text-rose-600' : 'text-emerald-600'" 
                          class="font-black text-lg">
                      {{ tx.transactionType === 'DEBIT' ? '-' : '+' }} {{ tx.amount | number:'1.2-2' }}
                    </span>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">FCFA</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class TransactionsHistoryComponent implements OnInit {
  private bankService = inject(BankService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  transactions: Transaction[] = [];
  loading = true;

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.fetchTransactions(userId);
    } else {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  fetchTransactions(userId: number): void {
    this.bankService.getAccountsByClient(userId).subscribe({
      next: (accounts: Account[]) => {
        console.log('Client accounts for transactions:', accounts);
        if (accounts.length === 0) {
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        const txRequests = accounts.map(acc => this.bankService.getTransactionsByAccount(acc.id));
        forkJoin(txRequests).subscribe({
          next: (results) => {
            console.log('Transactions results from all accounts:', results);
            // Flatten and sort by date
            const allTx = results.flat();
            this.transactions = allTx.sort((a, b) =>
              new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
            );
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err: any) => {
            console.error('Error fetching transactions', err);
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err: any) => {
        console.error('Error fetching accounts for transactions', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
