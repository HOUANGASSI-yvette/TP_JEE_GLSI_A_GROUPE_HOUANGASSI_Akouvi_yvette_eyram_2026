import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TransactionService } from '../../../services/transaction.service';
import { CompteService } from '../../../services/compte.service';
import { Compte } from '../../../models/compte.model';

@Component({
  selector: 'app-transaction-transfert',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './transaction-transfert.component.html',
  styleUrl: './transaction-transfert.component.css'
})
export class TransactionTransfertComponent implements OnInit {
  transfertForm: FormGroup;
  comptes: Compte[] = [];
  error: string | null = null;
  success = false;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private compteService: CompteService,
    private router: Router
  ) {
    this.transfertForm = this.fb.group({
      compteSourceId: ['', Validators.required],
      compteDestinationId: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(0.01)]],
      description: ['']
    }, {
      validators: this.compteDiffValidator
    });
  }

  ngOnInit(): void {
    this.loadComptes();
  }

  compteDiffValidator = (form: FormGroup) => {
    const source = form.get('compteSourceId');
    const dest = form.get('compteDestinationId');
    if (source && dest && source.value === dest.value && source.value !== '') {
      dest.setErrors({ sameAccount: true });
      return { sameAccount: true };
    }
    if (dest && dest.hasError('sameAccount') && source && dest.value !== source.value) {
      dest.setErrors(null);
    }
    return null;
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
    if (this.transfertForm.valid) {
      this.error = null;
      this.success = false;

      const { compteSourceId, compteDestinationId, montant, description } = this.transfertForm.value;

      this.transactionService.effectuerTransfert(compteSourceId, compteDestinationId, montant, description).subscribe({
        next: () => {
          this.success = true;
          setTimeout(() => {
            this.router.navigate(['/transactions']);
          }, 2000);
        },
        error: (err) => {
          this.error = err?.message || (err.status === 400 ? 'Solde insuffisant, compte non trouvé ou comptes identiques' : 'Erreur lors du transfert');
        }
      });
    }
  }
}

