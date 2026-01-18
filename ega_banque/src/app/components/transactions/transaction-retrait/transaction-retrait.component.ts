import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TransactionService } from '../../../services/transaction.service';
import { CompteService } from '../../../services/compte.service';
import { Compte } from '../../../models/compte.model';

@Component({
  selector: 'app-transaction-retrait',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './transaction-retrait.component.html',
  styleUrl: './transaction-retrait.component.css'
})
export class TransactionRetraitComponent implements OnInit {
  retraitForm: FormGroup;
  comptes: Compte[] = [];
  error: string | null = null;
  success = false;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private compteService: CompteService,
    private router: Router
  ) {
    this.retraitForm = this.fb.group({
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
    if (this.retraitForm.valid) {
      this.error = null;
      this.success = false;

      const { compteId, montant, description } = this.retraitForm.value;

      this.transactionService.effectuerRetrait(compteId, montant, description).subscribe({
        next: () => {
          this.success = true;
          setTimeout(() => {
            this.router.navigate(['/transactions']);
          }, 2000);
        },
        error: (err) => {
          this.error = err?.message || (err.status === 400 ? 'Solde insuffisant ou compte non trouvé' : 'Erreur lors du retrait');
        }
      });
    }
  }
}

