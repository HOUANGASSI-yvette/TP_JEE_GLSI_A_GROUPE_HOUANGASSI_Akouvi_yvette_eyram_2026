import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankService, Account } from '../../../core/services/bank.service';
import { NotificationService } from '../../../core/services/notification.service';
import { finalize, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-admin-deposit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-3xl mx-auto space-y-8 animate-fade-in-up pb-10">
      <div class="text-center md:text-left">
        <h2 class="text-3xl font-bold text-slate-900 font-primary tracking-tight">Dépôt Administratif</h2>
        <p class="text-slate-500 font-medium">Alimentez directement le compte d'un client en toute sécurité.</p>
      </div>

      <div class="bg-white rounded-xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        <!-- Decoration -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

        <div class="relative z-10" *ngIf="accounts$ | async as accounts; else loadingTemplate">
          <form [formGroup]="depositForm" (ngSubmit)="onSubmit()" class="space-y-8">
            <!-- Account Selection -->
            <div class="space-y-3">
              <label class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] block">Compte Bénéficiaire</label>
              <div class="relative">
                <select
                  formControlName="accountId"
                  class="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 p-5 pr-12 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="" disabled selected>Rechercher un compte...</option>
                  <option *ngFor="let acc of accounts" [value]="acc.id">
                    {{ acc.accountNumber }} — {{ acc.owner?.firstName }} {{ acc.owner?.lastName }} ({{ acc.balance | number: '1.0-0' }} FCFA)
                  </option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>
              <p *ngIf="depositForm.get('accountId')?.touched && depositForm.get('accountId')?.invalid" class="text-[10px] font-bold text-rose-500 uppercase tracking-wider mt-1 pl-1">
                La sélection d'un compte est obligatoire.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Amount -->
              <div class="space-y-3">
                <label class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] block">Montant du Dépôt</label>
                <div class="relative group">
                  <input
                    type="number"
                    formControlName="amount"
                    placeholder="0.00"
                    class="w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 pr-16 text-slate-900 font-black focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all"
                  />
                  <div class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 uppercase tracking-widest bg-white/50 px-2 py-1 rounded-lg">FCFA</div>
                </div>
                <p *ngIf="depositForm.get('amount')?.touched && depositForm.get('amount')?.invalid" class="text-[10px] font-bold text-rose-500 uppercase tracking-wider mt-1 pl-1">
                  Le montant doit être supérieur à 0.
                </p>
              </div>

              <!-- Ref/Description -->
              <div class="space-y-3">
                <label class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] block">Référence Opération</label>
                <input
                  type="text"
                  formControlName="description"
                  placeholder="Ex: Dépôt guichet..."
                  class="w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <!-- Submit -->
            <div class="pt-6">
              <button
                type="submit"
                [disabled]="depositForm.invalid || submitting"
                class="w-full py-5 bg-slate-900 text-white font-black rounded-lg hover:shadow-2xl hover:shadow-slate-900/20 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <span *ngIf="!submitting" class="uppercase tracking-[0.2em] text-sm">Valider le Dépôt</span>
                <span *ngIf="submitting" class="flex items-center gap-3">
                   <div class="h-5 w-5 border-2 border-slate-600 border-t-white rounded-full animate-spin"></div>
                   <span class="uppercase tracking-[0.2em] text-sm italic">Traitement...</span>
                </span>
                <svg *ngIf="!submitting" class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </form>
        </div>
        
        <ng-template #loadingTemplate>
           <div class="py-20 flex flex-col items-center justify-center gap-4">
              <div class="h-12 w-12 animate-spin rounded-full border-4 border-slate-100 border-t-emerald-500"></div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initialisation du service...</p>
           </div>
        </ng-template>
      </div>

      <!-- Compliance Note -->
      <div class="bg-amber-50 rounded-xl p-6 border border-amber-100 flex items-start gap-4">
        <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <div>
           <h4 class="text-sm font-black text-amber-900 uppercase tracking-widest mb-1">Audit & Conformité</h4>
           <p class="text-xs text-amber-700 leading-relaxed font-medium">
             Toute opération administrative est journalisée et soumise à un audit de conformité. 
             Une fois validé, le solde du bénéficiaire est crédité instantanément et de manière irréversible.
           </p>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class AdminDepositComponent implements OnInit {
  private fb = inject(FormBuilder);
  private bankService = inject(BankService);
  private notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  depositForm: FormGroup;
  accounts$: Observable<Account[]> = of([]);
  submitting = false;

  constructor() {
    this.depositForm = this.fb.group({
      accountId: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      description: ['Dépôt administratif', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accounts$ = this.bankService.getAllAccounts().pipe(
      catchError((err) => {
        console.error('Error loading accounts', err);
        return of([]);
      }),
    );
  }

  onSubmit(): void {
    if (this.depositForm.invalid) return;

    this.submitting = true;
    const { accountId, amount, description } = this.depositForm.value;

    const transaction = {
      amount,
      transactionType: 'DEPOSIT',
      description,
      sourceAccount: { id: parseInt(accountId) },
      transactionDate: new Date().toISOString()
    };

    console.log('Admin Deposit Payload:', transaction);

    this.bankService
      .createTransaction(transaction)
      .pipe(finalize(() => {
        this.submitting = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: () => {
          this.notificationService.show('Le dépôt a été crédité avec succès.', 'success');
          this.depositForm.reset({
            accountId: '',
            amount: null,
            description: 'Dépôt administratif',
          });
          this.loadAccounts(); // Refresh balances
        },
        error: (err) => {
          console.error('Error performing deposit', err);
          this.notificationService.show('Impossible de finaliser le dépôt. Vérifiez les données.', 'error');
        },
      });
  }
}
