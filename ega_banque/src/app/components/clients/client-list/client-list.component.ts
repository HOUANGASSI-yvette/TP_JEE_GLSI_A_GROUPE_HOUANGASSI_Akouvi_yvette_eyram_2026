import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-client-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  error: string | null = null;
  isLoading = false;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadClients();
    // Recharger les données quand on revient sur cette page
    this.route.params.subscribe(() => {
      this.loadClients();
    });
  }

  loadClients(): void {
    this.error = null;
    this.isLoading = true;
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Erreur lors du chargement des clients';
        this.isLoading = false;
      }
    });
  }

  deleteClient(id: number | undefined): void {
    if (!id) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => {
          this.loadClients();
        },
        error: (err) => {
          alert('Erreur lors de la suppression: ' + (err?.message || 'Erreur inconnue'));
        }
      });
    }
  }
}

