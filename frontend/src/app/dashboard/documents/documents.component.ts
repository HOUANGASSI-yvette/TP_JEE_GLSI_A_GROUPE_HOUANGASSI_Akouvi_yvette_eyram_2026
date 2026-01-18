import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-10 animate-fade-in-up pb-10">
      <div class="text-center md:text-left">
        <h2 class="text-3xl font-bold text-slate-900 font-primary">Archives & Documents</h2>
        <p class="text-slate-500 font-medium tracking-wide">Accédez en toute sécurité à vos relevés et attestations officielles.</p>
      </div>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div *ngFor="let doc of documents" class="group bg-white rounded-xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 transition-all hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden">
          <!-- Hover Accent -->
          <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-900 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div class="flex items-center gap-5 mb-8">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-amber-400 transition-all duration-300 shadow-sm">
              <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="min-w-0">
              <h4 class="font-bold text-slate-900 truncate font-primary leading-tight mb-1">{{ doc.name }}</h4>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{{ doc.date | date:'MMMM yyyy' }} • {{ doc.size }}</p>
            </div>
          </div>

          <button class="w-full py-3.5 flex items-center justify-center gap-2 rounded-lg bg-slate-50 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Télécharger PDF
          </button>
        </div>
      </div>

      <!-- Empty/Info Section -->
      <div class="bg-slate-900/5 rounded-3xl p-8 border-2 border-dashed border-slate-200 text-center">
         <div class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 mb-4 shadow-sm">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
         </div>
         <p class="text-sm font-bold text-slate-900 uppercase tracking-widest">Informations sur l'archivage</p>
         <p class="text-xs text-slate-500 max-w-lg mx-auto mt-2 leading-relaxed">
           Vos documents sont disponibles en ligne pendant une durée de 10 ans conformément à la réglementation bancaire en vigueur. Pour toute demande d'historique plus ancien, veuillez contacter votre agence.
         </p>
      </div>
    </div>
  `
})
export class DocumentsComponent {
  documents = [
    { name: 'Relevé de compte mensuel', date: new Date(2025, 11), size: '156 KB' },
    { name: 'Relevé de compte mensuel', date: new Date(2025, 10), size: '142 KB' },
    { name: 'RIB / Attestation IBAN', date: new Date(2025, 0), size: '45 KB' },
    { name: 'Attestation de solde annuel', date: new Date(2025, 11), size: '89 KB' },
  ];
}
