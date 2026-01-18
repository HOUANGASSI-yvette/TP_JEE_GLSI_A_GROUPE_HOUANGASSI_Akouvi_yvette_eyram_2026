import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CompteService } from '../../../services/compte.service';
import { ClientService } from '../../../services/client.service';
import { Compte } from '../../../models/compte.model';
import { Client } from '../../../models/client.model';
import { TypeCompte } from '../../../models/compte.model';

@Component({
  selector: 'app-compte-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './compte-list.component.html',
  styleUrl: './compte-list.component.css'
})
export class CompteListComponent implements OnInit {
  comptes: Compte[] = [];
  clients: Client[] = [];
  error: string | null = null;
  isLoading = false;
  TypeCompte = TypeCompte;

  constructor(
    private compteService: CompteService,
    private clientService: ClientService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadData();
    // Recharger les données quand on revient sur cette page
    this.route.params.subscribe(() => {
      this.loadData();
    });
  }

  loadData(): void {
    this.error = null;
    this.isLoading = true;
    
    // Charger les clients et comptes en parallèle pour plus de rapidité
    let clientsLoaded = false;
    let comptesLoaded = false;
    
    const checkComplete = () => {
      if (clientsLoaded && comptesLoaded) {
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
        comptesLoaded = true;
        checkComplete();
      },
      error: (err) => {
        this.error = err?.message || 'Erreur lors du chargement des comptes';
        comptesLoaded = true;
        checkComplete();
      }
    });
  }

  getClientName(clientId: number | undefined): string {
    if (!clientId) return 'N/A';
    const client = this.clients.find(c => c.id === clientId);
    return client ? `${client.prenom} ${client.nom}` : 'N/A';
  }

  deleteCompte(id: number | undefined): void {
    if (!id) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      this.compteService.deleteCompte(id).subscribe({
        next: () => {
          this.loadData();
        },
        error: (err) => {
          alert('Erreur lors de la suppression: ' + (err?.message || 'Erreur inconnue'));
        }
      });
    }
  }
}

