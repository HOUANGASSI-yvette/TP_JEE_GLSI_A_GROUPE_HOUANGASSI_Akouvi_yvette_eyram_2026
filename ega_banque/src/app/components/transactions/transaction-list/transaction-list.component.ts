import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TransactionService } from '../../../services/transaction.service';
import { CompteService } from '../../../services/compte.service';
import { Transaction, TypeTransaction } from '../../../models/transaction.model';
import { Compte } from '../../../models/compte.model';

@Component({
  selector: 'app-transaction-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css'
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  comptes: Compte[] = [];
  error: string | null = null;
  TypeTransaction = TypeTransaction;

  constructor(
    private transactionService: TransactionService,
    private compteService: CompteService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.error = null;

    this.compteService.getAllComptes().subscribe({
      next: (comptes) => {
        this.comptes = comptes || [];
      },
      error: () => {}
    });

    this.transactionService.getAllTransactions().subscribe({
      next: (transactions) => {
        const sortedTransactions = (transactions || []).sort((a, b) => {
          const dateA = a.dateTransaction ? new Date(a.dateTransaction).getTime() : 0;
          const dateB = b.dateTransaction ? new Date(b.dateTransaction).getTime() : 0;
          return dateB - dateA;
        });
        this.transactions = sortedTransactions;
      },
      error: (err) => {
        this.error = err?.message || 'Erreur lors du chargement des transactions';
      }
    });
  }

  getCompteNumero(compteId: number | undefined): string {
    if (!compteId) return 'N/A';
    const compte = this.comptes.find(c => c.id === compteId);
    return compte?.numCompte || 'N/A';
  }
}

