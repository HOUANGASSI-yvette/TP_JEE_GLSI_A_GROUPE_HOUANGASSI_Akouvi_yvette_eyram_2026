import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-client-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export class ClientFormComponent implements OnInit {
  clientForm: FormGroup;
  isEditMode = false;
  clientId: number | null = null;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clientForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      sexe: ['', Validators.required],
      courriel: ['', [Validators.required, Validators.email]],
      adresse: ['', Validators.required],
      numTelephone: ['', Validators.required],
      nationalite: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.clientId = +id;
      this.loadClient(this.clientId);
    }
  }

  loadClient(id: number): void {
    this.clientService.getClientById(id).subscribe({
      next: (client) => {
        const dateNaissance = client.dateNaissance ? new Date(client.dateNaissance).toISOString().split('T')[0] : '';
        this.clientForm.patchValue({
          ...client,
          dateNaissance
        });
      },
      error: (err) => {
        this.error = err?.message || 'Erreur lors du chargement du client';
      }
    });
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      this.error = null;
      const clientData: Client = this.clientForm.value;

      if (this.isEditMode && this.clientId) {
        this.clientService.updateClient(this.clientId, clientData).subscribe({
          next: () => {
            this.router.navigate(['/clients']);
          },
          error: (err) => {
            this.error = err?.message || 'Erreur lors de la mise à jour';
          }
        });
      } else {
        this.clientService.createClient(clientData).subscribe({
          next: () => {
            this.router.navigate(['/clients']);
          },
          error: (err) => {
            this.error = err?.message || 'Erreur lors de la création';
          }
        });
      }
    }
  }
}

