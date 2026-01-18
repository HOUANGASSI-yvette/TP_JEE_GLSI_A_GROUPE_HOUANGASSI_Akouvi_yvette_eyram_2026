import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankService } from '../../core/services/bank.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

interface ClientProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  nationality?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  isActive: boolean;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  username?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div class="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <h2 class="text-3xl font-bold text-slate-900 font-primary">Mon Profil</h2>
          <p class="text-slate-500 mt-1">Gérez vos informations personnelles et vos préférences de sécurité.</p>
        </div>
        <div class="hidden md:block">
           <span class="bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
             {{ isClient ? 'Compte Client' : 'Compte Administrateur' }}
           </span>
        </div>
      </div>

      <div class="grid gap-8 md:grid-cols-3" *ngIf="!loading && client; else loadingState">
        <!-- Sidebar with avatar -->
        <div class="md:col-span-1 space-y-6">
          <div class="bg-white rounded-xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center relative overflow-hidden">
             <div class="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-slate-900 to-slate-800 z-0"></div>
             
            <div class="relative z-10 mx-auto w-32 h-32 mb-4">
              <div class="w-full h-full rounded-xl bg-white p-1 shadow-lg transform rotate-3 transition-transform hover:rotate-0">
                <div class="w-full h-full rounded-lg bg-slate-900 flex items-center justify-center text-amber-400 font-bold text-4xl border border-slate-800">
                  {{ client.firstName.charAt(0) }}{{ client.lastName.charAt(0) }}
                </div>
              </div>
              <div class="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
            </div>
            
            <div class="relative z-10">
              <h3 class="text-xl font-bold text-slate-900 mb-1">{{ client.firstName }} {{ client.lastName }}</h3>
              <p class="text-sm font-medium text-amber-600 mb-4">{{ client.email }}</p>
              
              <div class="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                <span class="text-xs text-slate-500 font-medium">Membre depuis {{ client.createdAt | date:'yyyy' }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100">
            <h4 class="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">Statut du compte</h4>
            <div class="flex items-center gap-3 p-4 rounded-lg border" [ngClass]="client.isActive ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'">
              <div class="h-2.5 w-2.5 rounded-full animate-pulse" [ngClass]="client.isActive ? 'bg-emerald-500' : 'bg-red-500'"></div>
              <span class="font-bold text-sm">{{ client.isActive ? 'Vérifié & Actif' : 'Inactif' }}</span>
            </div>
          </div>
        </div>

        <!-- Main form -->
        <div class="md:col-span-2 space-y-6">
          <form (ngSubmit)="saveProfile()" #profileForm="ngForm" class="bg-white rounded-xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div class="flex items-center gap-3 mb-8">
               <div class="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-900">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                 </svg>
               </div>
               <h4 class="text-xl font-bold text-slate-900 font-primary">Informations Personnelles</h4>
            </div>
            
            <div class="grid gap-6 md:grid-cols-2">
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Prénom</label>
                <input type="text" [(ngModel)]="editClient.firstName" name="firstName" class="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all font-medium text-slate-800 placeholder-slate-400" />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Nom</label>
                <input type="text" [(ngModel)]="editClient.lastName" name="lastName" class="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all font-medium text-slate-800 placeholder-slate-400" />
              </div>

              <div class="space-y-2 md:col-span-2" *ngIf="!isClient">
                <label class="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Nom d'utilisateur</label>
                <input type="text" [(ngModel)]="editClient.username" name="username" class="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all font-medium text-slate-800 placeholder-slate-400" />
              </div>
              
              <div class="space-y-2 md:col-span-2">
                <label class="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email (Identifiant)</label>
                <div class="relative">
                  <input type="email" [value]="client.email" readonly class="w-full rounded-lg border border-slate-100 bg-slate-100 p-3.5 text-slate-500 cursor-not-allowed font-mono text-sm" />
                   <div class="absolute right-3 top-3.5 text-slate-400">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                       <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
                     </svg>
                   </div>
                </div>
              </div>

              <ng-container *ngIf="isClient">
                <div class="space-y-2">
                  <label class="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Téléphone</label>
                  <input type="text" [(ngModel)]="editClient.phoneNumber" name="phoneNumber" class="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all font-medium text-slate-800 placeholder-slate-400" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Nationalité</label>
                  <input type="text" [(ngModel)]="editClient.nationality" name="nationality" class="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all font-medium text-slate-800 placeholder-slate-400" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Date de naissance</label>
                  <input type="date" [(ngModel)]="editClient.birthDate" name="birthDate" class="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all font-medium text-slate-800" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Genre</label>
                  <select [(ngModel)]="editClient.gender" name="gender" class="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all font-medium text-slate-800">
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                    <option value="O">Autre</option>
                  </select>
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Adresse postale</label>
                  <textarea [(ngModel)]="editClient.address" name="address" rows="3" class="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all font-medium text-slate-800 placeholder-slate-400 resize-none"></textarea>
                </div>
              </ng-container>
            </div>

            <div class="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button type="submit" [disabled]="saving" class="w-full md:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 shadow-lg shadow-slate-900/20 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <span *ngIf="!saving">Sauvegarder les modifications</span>
                <span *ngIf="saving" class="flex items-center gap-2">
                   <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                     <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Enregistrement...
                </span>
              </button>
            </div>
          </form>

          <div class="bg-white rounded-2xl p-8 shadow-sm border border-red-100 flex items-center justify-between">
            <div>
              <h4 class="text-lg font-bold text-red-600 mb-1">Zone de Danger</h4>
              <p class="text-sm text-slate-500">La suppression de votre compte est définitive et irréversible.</p>
            </div>
            
            <button class="px-6 py-2.5 bg-red-50 text-red-600 font-bold rounded-md hover:bg-red-100 transition-colors border border-red-100">
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <ng-template #loadingState>
        <div class="flex h-96 items-center justify-center">
           <div class="relative">
             <div class="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
             <div class="absolute inset-0 flex items-center justify-center font-bold text-slate-900 text-xs">EGA</div>
           </div>
        </div>
      </ng-template>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  private bankService = inject(BankService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  client: ClientProfile | null = null;
  editClient: ClientProfile = {} as ClientProfile;
  loading = true;
  saving = false;
  isClient = false;

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    const userType = this.authService.getUserType();
    this.isClient = userType === 'CLIENT';

    if (userId) {
      if (this.isClient) {
        this.fetchClientProfile(userId);
      } else {
        this.fetchAdminProfile(userId);
      }
    } else {
      this.loading = false;
    }
  }

  fetchClientProfile(userId: number): void {
    this.loading = true;
    this.bankService.getClientProfile(userId).subscribe({
      next: (data: ClientProfile) => {
        this.client = data;
        this.editClient = { ...data };
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error fetching client profile', err);
        this.notificationService.error('Impossible de charger le profil client');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  fetchAdminProfile(userId: number): void {
    this.loading = true;
    this.bankService.getAdminProfile(userId).subscribe({
      next: (data: any) => {
        this.client = data;
        this.editClient = { ...data };
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error fetching admin profile', err);
        this.notificationService.error('Impossible de charger le profil admin');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveProfile(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.saving = true;
    this.cdr.detectChanges();

    if (this.isClient) {
      this.bankService.updateClientProfile(userId, this.editClient).subscribe({
        next: (updated: ClientProfile) => {
          this.client = updated;
          this.saving = false;
          this.notificationService.success('Profil mis à jour avec succès !');
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error updating profile', err);
          this.saving = false;
          this.notificationService.error('Erreur lors de la mise à jour du profil.');
          this.cdr.detectChanges();
        }
      });
    } else {
      this.bankService.updateAdminProfile(userId, this.editClient).subscribe({
        next: (updated: any) => {
          this.client = updated;
          this.saving = false;
          this.notificationService.success('Profil administrateur mis à jour !');
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error updating admin profile', err);
          this.saving = false;
          this.notificationService.error('Erreur lors de la mise à jour.');
          this.cdr.detectChanges();
        }
      });
    }
  }
}
