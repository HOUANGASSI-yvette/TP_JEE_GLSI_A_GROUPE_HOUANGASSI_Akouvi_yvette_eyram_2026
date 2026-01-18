import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { CompteService } from '../../services/compte.service';
import { TransactionService } from '../../services/transaction.service';
import { Client } from '../../models/client.model';
import { Compte } from '../../models/compte.model';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  clients: Client[] = [];
  comptes: Compte[] = [];
  transactions: Transaction[] = [];
  totalSolde: number = 0;
  isLoading = false;

  constructor(
    private clientService: ClientService,
    private compteService: CompteService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    
    let clientsLoaded = false;
    let comptesLoaded = false;
    let transactionsLoaded = false;
    
    const checkComplete = () => {
      if (clientsLoaded && comptesLoaded && transactionsLoaded) {
        this.isLoading = false;
      }
    };
    
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients || [];
        clientsLoaded = true;
        checkComplete();
      },
      error: (err) => {
        clientsLoaded = true;
        checkComplete();
      }
    });

    this.compteService.getAllComptes().subscribe({
      next: (comptes) => {
        this.comptes = comptes || [];
        this.totalSolde = (comptes || []).reduce((sum, compte) => sum + (compte.solde || 0), 0);
        comptesLoaded = true;
        checkComplete();
      },
      error: (err) => {
        comptesLoaded = true;
        checkComplete();
      }
    });

    this.transactionService.getAllTransactions().subscribe({
      next: (transactions) => {
        this.transactions = (transactions || []).slice(0, 5); // Dernières 5 transactions
        transactionsLoaded = true;
        checkComplete();
      },
      error: (err) => {
        transactionsLoaded = true;
        checkComplete();
      }
    });
  }
}

