import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BankService, Account } from '../../../core/services/bank.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-3xl mx-auto space-y-8 animate-fade-in-up pb-10">
      <div class="text-center md:text-left">
        <h2 class="text-3xl font-bold text-slate-900 font-primary">Nouveau Virement</h2>
        <p class="text-slate-500 font-medium">Effectuez des transferts sécurisés en quelques secondes.</p>
      </div>

      <div class="bg-white rounded-xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        <!-- Abstract Decoration -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

        <div class="space-y-8 relative z-10">
          <!-- Source Account -->
          <div class="space-y-3">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-widest block">Compte à débiter</label>
            <div class="relative">
                <select
                [(ngModel)]="transferData.sourceAccountId"
                name="sourceAccount"
                class="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 p-4 pr-12 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all cursor-pointer"
                >
                <option [ngValue]="null" disabled selected>Sélectionnez un compte source</option>
                <option *ngFor="let acc of myAccounts" [ngValue]="acc.id">
                    {{ acc.accountType === 'CHECKING' ? 'Compte Courant' : 'Compte Épargne' }} • {{ acc.accountNumber }} ({{ acc.balance | number:'1.2-2' }} FCFA)
                </option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
            </div>
          </div>

          <!-- Destination & Amount Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-3">
              <label class="text-xs font-bold text-slate-400 uppercase tracking-widest block">Compte destinataire (IBAN)</label>
              <input
                type="text"
                [(ngModel)]="transferData.destinationIBAN"
                name="destinationIBAN"
                placeholder="Ex: TG00 0000..."
                class="w-full rounded-xl border border-slate-200 p-4 font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-300"
              />
            </div>

            <div class="space-y-3">
              <label class="text-xs font-bold text-slate-400 uppercase tracking-widest block">Montant</label>
              <div class="relative">
                <input
                  type="number"
                  [(ngModel)]="transferData.amount"
                  name="amount"
                  min="100"
                  placeholder="0.00"
                  class="w-full rounded-xl border border-slate-200 p-4 pr-16 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-300"
                />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">FCFA</span>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-3">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-widest block">Motif (Optionnel)</label>
            <input
              type="text"
              [(ngModel)]="transferData.description"
              name="description"
              placeholder="Ex: Loyer, Cadeau..."
              class="w-full rounded-xl border border-slate-200 p-4 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-300"
            />
          </div>

          <!-- Action Button -->
          <div class="pt-6">
            <button
              type="button"
              (click)="submitTransfer()"
              [disabled]="loading"
              class="w-full py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-slate-900/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3"
            >
              <span *ngIf="!loading" class="tracking-wide uppercase text-sm">Confirmer le virement</span>
              <span *ngIf="loading" class="flex items-center justify-center gap-2">
                <div class="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-white"></div>
                <span class="text-sm font-medium">Traitement sécurisé...</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Security Note -->
      <div class="flex items-start gap-4 p-6 rounded-xl bg-slate-50 border border-slate-100">
        <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        </div>
        <div>
           <h4 class="font-bold text-slate-900 text-sm mb-1">Transaction Sécurisée</h4>
           <p class="text-xs text-slate-500 leading-relaxed">
             Vos virements sont protégés par un chiffrement de niveau bancaire. 
             Assurez-vous de l'exactitude de l'IBAN du bénéficiaire avant de valider l'opération.
           </p>
        </div>
      </div>
    </div>
  `
})
export class TransferComponent implements OnInit {
  private bankService = inject(BankService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  myAccounts: Account[] = [];
  loading = false;
  transferData = {
    sourceAccountId: null as number | null,
    destinationIBAN: '',
    amount: null as number | null,
    description: ''
  };

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.fetchMyAccounts(userId);
    }

    // Pre-select account from query params if available
    this.route.queryParams.subscribe(params => {
      if (params['from']) {
        this.transferData.sourceAccountId = +params['from'];
        this.cdr.detectChanges();
      }
    });
  }

  fetchMyAccounts(userId: number): void {
    this.bankService.getAccountsByClient(userId).subscribe({
      next: (accounts: Account[]) => {
        this.myAccounts = accounts;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error fetching accounts', err);
      }
    });
  }

  submitTransfer(): void {
    console.log('Action: submitTransfer click');

    // Manual Validation
    if (!this.transferData.sourceAccountId) {
      this.notificationService.warning('Veuillez sélectionner un compte source.');
      return;
    }
    if (!this.transferData.destinationIBAN || this.transferData.destinationIBAN.trim().length < 5) {
      this.notificationService.warning('Veuillez saisir un IBAN valide.');
      return;
    }
    if (!this.transferData.amount || this.transferData.amount <= 0) {
      this.notificationService.warning('Veuillez saisir un montant valide.');
      return;
    }

    // Check balance locally
    const sourceAcc = this.myAccounts.find(a => a.id === this.transferData.sourceAccountId);
    if (sourceAcc && sourceAcc.balance < this.transferData.amount) {
      this.notificationService.error('Solde insuffisant.');
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    const payload = {
      amount: this.transferData.amount,
      description: this.transferData.description,
      transactionType: 'TRANSFER',
      sourceAccount: { id: this.transferData.sourceAccountId },
      destinationAccount: { accountNumber: this.transferData.destinationIBAN },
      transactionDate: new Date().toISOString()
    };

    console.log('API Call: createTransaction', payload);

    this.bankService.createTransaction(payload).subscribe({
      next: (res: any) => {
        console.log('API Success:', res);
        this.notificationService.success('Virement effectué !');
        this.router.navigate(['/dashboard/transactions']);
      },
      error: (err: any) => {
        console.error('API Error:', err);
        const msg = err.status === 403 ? 'Solde insuffisant.' :
          err.status === 404 ? 'Compte destinataire introuvable.' :
            'Erreur lors du virement.';
        this.notificationService.error(msg);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
