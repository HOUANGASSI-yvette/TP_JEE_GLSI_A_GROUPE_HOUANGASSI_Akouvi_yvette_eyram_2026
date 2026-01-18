import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CompteService } from '../../../services/compte.service';
import { ClientService } from '../../../services/client.service';
import { Compte, TypeCompte } from '../../../models/compte.model';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-compte-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './compte-form.component.html',
  styleUrl: './compte-form.component.css'
})
export class CompteFormComponent implements OnInit {
  compteForm: FormGroup;
  isEditMode = false;
  compteId: number | null = null;
  error: string | null = null;
  isLoading = false;
  isLoadingClients = false;
  clients: Client[] = [];
  TypeCompte = TypeCompte;
  typeCompteValues = Object.values(TypeCompte);

  constructor(
    private fb: FormBuilder,
    private compteService: CompteService,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Le numCompte n'est pas requis pour la création (généré automatiquement par l'IBAN)
    this.compteForm = this.fb.group({
      typeCompte: ['', Validators.required],
      solde: [0, [Validators.required, Validators.min(0)]],
      clientId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadClients();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.compteId = +id;
      // En mode édition, on ajoute le champ numCompte (lecture seule)
      this.compteForm.addControl('numCompte', this.fb.control({value: '', disabled: true}));
      this.loadCompte(this.compteId);
    }
  }

  loadClients(): void {
    this.isLoadingClients = true;
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients || [];
        this.isLoadingClients = false;
      },
      error: (err) => {
        this.isLoadingClients = false;
      }
    });
  }

  loadCompte(id: number): void {
    this.compteService.getCompteById(id).subscribe({
      next: (compte) => {
        // En mode édition, on met à jour le numCompte (lecture seule)
        this.compteForm.patchValue({
          typeCompte: compte.typeCompte,
          solde: compte.solde,
          clientId: compte.clientId,
          numCompte: compte.numCompte
        });
      },
      error: (err) => {
        this.error = err?.message || 'Erreur lors du chargement du compte';
      }
    });
  }

  onSubmit(): void {
    // Marquer tous les champs comme touchés pour afficher les erreurs
    this.compteForm.markAllAsTouched();
    
    if (this.compteForm.valid && !this.isLoading) {
      this.error = null;
      this.isLoading = true;
      
      // Pour la création, on ne doit pas envoyer numCompte (généré automatiquement par l'IBAN)
      // Pour l'édition, on récupère la valeur même si le champ est désactivé
      const formValue = this.compteForm.getRawValue();
      
      // Convertir clientId en nombre (car le select HTML retourne une string)
      const clientId = Number(formValue.clientId);
      const solde = Number(formValue.solde);
      
      // Validation supplémentaire
      if (!clientId || isNaN(clientId)) {
        this.error = 'Veuillez sélectionner un client';
        this.isLoading = false;
        return;
      }
      
      if (isNaN(solde) || solde < 0) {
        this.error = 'Le solde doit être un nombre positif';
        this.isLoading = false;
        return;
      }
      
      // Timeout pour éviter que le spinner tourne indéfiniment
      const timeout = setTimeout(() => {
        if (this.isLoading) {
          this.isLoading = false;
          this.error = 'Le serveur ne répond pas. Vérifiez que le backend est démarré.';
        }
      }, 15000); // 15 secondes de timeout
      
      // En mode édition, on inclut le numCompte
      if (this.isEditMode && this.compteId) {
        const compteData: Compte = {
          numCompte: formValue.numCompte,
          typeCompte: formValue.typeCompte,
          solde: solde,
          clientId: clientId
        };
        this.compteService.updateCompte(this.compteId, compteData).subscribe({
          next: () => {
            clearTimeout(timeout);
            this.isLoading = false;
            this.router.navigate(['/comptes']);
          },
          error: (err) => {
            clearTimeout(timeout);
            this.isLoading = false;
            this.error = err?.message || 'Erreur lors de la mise à jour';
          }
        });
      } else {
        // En mode création, le numCompte sera généré automatiquement par le backend (IBAN)
        const compteData: Compte = {
          typeCompte: formValue.typeCompte,
          solde: solde,
          clientId: clientId
        };
        this.compteService.createCompte(compteData).subscribe({
          next: () => {
            clearTimeout(timeout);
            this.isLoading = false;
            this.router.navigate(['/comptes']);
          },
          error: (err) => {
            clearTimeout(timeout);
            this.isLoading = false;
            this.error = err?.message || 'Erreur lors de la création';
          }
        });
      }
    } else {
      // Afficher les erreurs de validation
      const errors = [];
      if (this.compteForm.get('typeCompte')?.invalid) {
        errors.push('Le type de compte est requis');
      }
      if (this.compteForm.get('clientId')?.invalid) {
        errors.push('Le client est requis');
      }
      if (this.compteForm.get('solde')?.invalid) {
        errors.push('Le solde doit être supérieur ou égal à 0');
      }
      this.error = errors.join(', ') || 'Veuillez remplir tous les champs requis';
    }
  }
}

