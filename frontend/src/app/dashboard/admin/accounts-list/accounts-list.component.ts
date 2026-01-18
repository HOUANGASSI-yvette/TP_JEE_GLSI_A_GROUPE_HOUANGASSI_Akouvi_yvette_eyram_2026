import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankService, Account } from '../../../core/services/bank.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-accounts-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-8 animate-fade-in-up pb-10">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div class="space-y-2">
          <h2 class="text-3xl font-bold text-slate-900 font-primary tracking-tight">Gestion des Comptes</h2>
          <p class="text-slate-500 font-medium tracking-wide">Contrôle global des comptes bancaires actifs.</p>
        </div>
        
        <div class="flex items-center gap-4 bg-white px-6 py-3 rounded-lg shadow-sm border border-slate-100">
           <span class="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">Total</span>
           <span class="text-2xl font-black text-emerald-500 leading-none">{{ accounts.length }}</span>
        </div>
      </div>

      <!-- Accounts Card -->
      <div class="bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse" *ngIf="accounts.length > 0; else noAccountsTemplate">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-100">
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Référence IBAN</th>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Propriétaire</th>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Type</th>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Solde Actuel</th>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let account of accounts" class="group hover:bg-slate-50/50 transition-all duration-200">
                <td class="px-8 py-6">
                  <div class="flex items-center space-x-4">
                    <div class="h-10 w-10 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center font-bold border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                      </svg>
                    </div>
                    <div>
                      <div class="font-mono text-sm font-bold text-slate-900 leading-none mb-1 group-hover:text-amber-600 transition-colors">
                        {{ account.accountNumber }}
                      </div>
                      <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">ID: #{{ account.id }}</div>
                    </div>
                  </div>
                </td>
                
                <td class="px-8 py-6">
                  <div class="text-sm text-slate-900 font-bold mb-0.5">{{ account.owner?.firstName }} {{ account.owner?.lastName }}</div>
                  <div class="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{{ account.owner?.email }}</div>
                </td>

                <td class="px-8 py-6">
                  <span [ngClass]="account.accountType === 'SAVINGS' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-blue-100 text-blue-700 border-blue-200'" 
                        class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border">
                    {{ account.accountType === 'SAVINGS' ? 'Epargne' : 'Courant' }}
                  </span>
                </td>

                <td class="px-8 py-6 text-right">
                  <div class="flex flex-col items-end">
                    <span class="text-lg font-black text-slate-900 font-primary">{{ account.balance | number: '1.2-2' }}</span>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">FCFA</span>
                  </div>
                </td>

                <td class="px-8 py-6">
                   <div class="text-sm font-bold text-slate-600">
                      {{ account.creationDate || account.createdAt | date: 'dd/MM/yyyy' }}
                   </div>
                </td>

                <td class="px-8 py-6 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button (click)="openEditModal(account)" class="w-10 h-10 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all duration-300 flex items-center justify-center border border-slate-100 shadow-sm" title="Modifier">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                    <button (click)="deleteAccount(account.id)" class="w-10 h-10 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-600 hover:text-white transition-all duration-300 flex items-center justify-center border border-rose-100 shadow-sm" title="Supprimer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <ng-template #noAccountsTemplate>
            <div *ngIf="!loading" class="p-20 text-center bg-slate-50/50">
              <div class="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-6 text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              </div>
              <p class="text-slate-500 font-bold font-primary text-xl">Aucun compte actif</p>
              <p class="text-slate-400 text-sm mt-1">Aucun compte n'a été créé par les clients jusqu'à présent.</p>
            </div>
          </ng-template>
        </div>
        
        <div *ngIf="loading" class="p-20 flex flex-col items-center justify-center gap-4 bg-slate-50/30">
           <div class="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500"></div>
           <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Mise à jour...</p>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div *ngIf="showEditModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div class="bg-white w-full max-w-xl rounded-xl shadow-2xl border border-white overflow-hidden animate-in zoom-in-95 duration-300">
        <div class="p-8 md:p-10">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-2xl font-bold text-slate-900 font-primary">Modifier le Compte</h3>
            <button (click)="closeEditModal()" class="w-10 h-10 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form [formGroup]="editForm" (ngSubmit)="updateAccount()" class="space-y-6">
            <div class="space-y-2">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Numéro de compte / IBAN</label>
              <input type="text" formControlName="accountNumber" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-900 font-mono font-bold focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all">
            </div>

            <div class="space-y-2">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Type de Compte</label>
              <select formControlName="accountType" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-900 font-bold focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all appearance-none cursor-pointer">
                <option value="CHECKING">Compte Courant</option>
                <option value="SAVINGS">Compte Épargne</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Solde Actuel (FCFA)</label>
              <div class="relative">
                <input type="number" formControlName="balance" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-900 font-black focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all">
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 uppercase tracking-widest">FCFA</span>
              </div>
            </div>

            <div class="pt-4 flex gap-4">
              <button type="button" (click)="closeEditModal()" class="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-lg hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">
                Annuler
              </button>
              <button type="submit" [disabled]="editForm.invalid || submitting" class="flex-1 py-4 bg-slate-900 text-white font-black rounded-lg hover:shadow-xl hover:shadow-slate-900/20 hover:-translate-y-0.5 transition-all uppercase tracking-widest text-xs disabled:opacity-50">
                Mettre à jour le compte
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class AdminAccountsListComponent implements OnInit {
  private bankService = inject(BankService);
  private notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  accounts: Account[] = [];
  loading = false;
  submitting = false;

  showEditModal = false;
  editForm!: FormGroup;
  selectedAccount: Account | null = null;

  constructor() {
    this.editForm = this.fb.group({
      accountNumber: ['', Validators.required],
      accountType: ['CHECKING', Validators.required],
      balance: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;
    this.bankService.getAllAccounts().pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      }),
      catchError((err) => {
        console.error('Error loading accounts', err);
        return of([]);
      }),
    ).subscribe(data => {
      this.accounts = data;
    });
  }

  openEditModal(account: Account): void {
    this.selectedAccount = account;
    this.editForm.patchValue({
      accountNumber: account.accountNumber,
      accountType: account.accountType,
      balance: account.balance,
    });
    this.showEditModal = true;
    this.cdr.detectChanges();
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedAccount = null;
    this.editForm.reset();
    this.cdr.detectChanges();
  }

  updateAccount(): void {
    if (this.editForm.invalid || !this.selectedAccount) return;

    this.submitting = true;
    this.bankService.updateAccount(this.selectedAccount.id, this.editForm.value).pipe(
      finalize(() => {
        this.submitting = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: () => {
        this.notificationService.show('Détails du compte mis à jour !', 'success');
        this.closeEditModal();
        this.loadAccounts();
      },
      error: (err) => {
        console.error('Error updating account', err);
        this.notificationService.show('Échec de la mise à jour du compte.', 'error');
      }
    });
  }

  deleteAccount(accountId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce compte ? Cette action est irréversible.')) {
      this.loading = true;
      this.bankService.deleteAccount(accountId).subscribe({
        next: () => {
          this.notificationService.show('Compte supprimé avec succès', 'success');
          this.loadAccounts();
        },
        error: (err) => {
          console.error('Error deleting account', err);
          this.notificationService.show('Erreur lors de la suppression', 'error');
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
