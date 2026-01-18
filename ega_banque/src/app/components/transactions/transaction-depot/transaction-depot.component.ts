import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TransactionService } from '../../../services/transaction.service';
import { CompteService } from '../../../services/compte.service';
import { Compte } from '../../../models/compte.model';

@Component({
  selector: 'app-transaction-depot',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './transaction-depot.component.html',
  styleUrl: './transaction-depot.component.css'
})
export class TransactionDepotComponent implements OnInit {
  depotForm: FormGroup;
  comptes: Compte[] = [];
  error: string | null = null;
  success = false;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private compteService: CompteService,
    private router: Router
  ) {
    this.depotForm = this.fb.group({
      compteId: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(0.01)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadComptes();
  }

  loadComptes(): void {
    this.compteService.getAllComptes().subscribe({
      next: (comptes) => {
        this.comptes = comptes || [];
      },
      error: () => {}
    });
  }

  onSubmit(): void {
    if (this.depotForm.valid) {
      this.error = null;
      this.success = false;

      const { compteId, montant, description } = this.depotForm.value;

      this.transactionService.effectuerDepot(compteId, montant, description).subscribe({
        next: () => {
          this.success = true;
          setTimeout(() => {
            this.router.navigate(['/transactions']);
          }, 2000);
        },
        error: (err) => {
          this.error = err?.message || 'Erreur lors du dépôt';
        }
      });
    }
  }
}

