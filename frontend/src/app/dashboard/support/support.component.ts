import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-5xl mx-auto space-y-10 animate-fade-in-up pb-10">
      <div class="text-center md:text-left">
        <h2 class="text-3xl font-bold text-slate-900 font-primary">Centre d'Assistance</h2>
        <p class="text-slate-500 font-medium">Une équipe d'experts à votre écoute pour vous accompagner au quotidien.</p>
      </div>

      <!-- Contact Grid -->
      <div class="grid gap-6 md:grid-cols-2">
        <!-- Phone Support -->
        <div class="group bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div class="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/5 rounded-full group-hover:bg-amber-500/10 transition-colors"></div>
          
          <div class="relative z-10">
            <div class="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-900 text-amber-400 mb-6 shadow-lg shadow-slate-900/20 group-hover:scale-110 transition-transform">
              <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-slate-900 font-primary">Ligne Prioritaire</h3>
            <p class="text-sm text-slate-500 mt-2 mb-6 leading-relaxed">Assistance technique et urgences bancaires disponible 24h/24 et 7j/7 sans interruption.</p>
            <a href="tel:+22822000000" class="inline-flex items-center text-lg font-black text-slate-900 hover:text-amber-600 transition-colors">
              +228 22 00 00 00
              <svg class="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </a>
          </div>
        </div>

        <!-- Email Support -->
        <div class="group bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div class="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/5 rounded-full group-hover:bg-blue-500/10 transition-colors"></div>

          <div class="relative z-10">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-amber-400 mb-6 shadow-lg shadow-slate-900/20 group-hover:scale-110 transition-transform">
              <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-slate-900 font-primary">Conciergerie Digitale</h3>
            <p class="text-sm text-slate-500 mt-2 mb-6 leading-relaxed">Pour toutes vos demandes administratives, gestion de dossier ou informations sur nos offres.</p>
            <a href="mailto:support@ega-banking.tg" class="inline-flex items-center text-base font-black text-slate-900 hover:text-amber-600 transition-colors underline decoration-amber-500/30 underline-offset-4">
              support&#64;ega-banking.tg
              <svg class="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </a>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="bg-white rounded-xl p-10 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
        <h3 class="text-2xl font-bold text-slate-900 font-primary mb-10 flex items-center gap-3">
          <span class="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-900 text-sm">
             ?
          </span>
          Questions Fréquentes
        </h3>
        
        <div class="divide-y divide-slate-100">
          <div *ngFor="let faq of faqs; let i = index" class="py-8 first:pt-0 last:pb-0 group cursor-pointer">
            <div class="flex items-start justify-between gap-6">
              <div class="space-y-3">
                <h4 class="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{{ faq.q }}</h4>
                <p class="text-slate-500 leading-relaxed font-medium">{{ faq.a }}</p>
              </div>
              <div class="shrink-0 w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-amber-500 group-hover:text-amber-500 transition-all">
                 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Tips -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div class="text-xs font-black text-amber-600 uppercase tracking-widest mb-2">Conseil Sécurité</div>
            <p class="text-xs text-slate-600 leading-relaxed font-medium">Ne partagez jamais votre code secret ou vos identifiants par téléphone ou email.</p>
         </div>
         <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div class="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Opposition Carte</div>
            <p class="text-xs text-slate-600 leading-relaxed font-medium">En cas de perte, bloquez instantanément votre carte depuis l'application mobile.</p>
         </div>
         <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div class="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2">Virement</div>
            <p class="text-xs text-slate-600 leading-relaxed font-medium">Les virements internes EgaBank sont gratuits et traités en temps réel (24h/24).</p>
         </div>
      </div>
    </div>
  `
})
export class SupportComponent {
  faqs = [
    { q: 'Comment changer mon code secret ?', a: 'Vous pouvez modifier votre code PIN à tout moment directement depuis la section Profile ou via l\'un de nos distributeurs automatiques EgaBank.' },
    { q: 'Quels sont les délais pour un virement ?', a: 'Les virements internes entre comptes EgaBank sont instantanés. Les virements externes vers les autres banques de la zone UEMOA prennent généralement 24 à 48 heures ouvrables.' },
    { q: 'Comment faire opposition à ma carte ?', a: 'En cas de perte ou de vol, contactez immédiatement notre ligne d\'urgence dédiée ou utilisez la fonction de verrouillage temporaire dans les paramètres de votre carte.' },
  ];
}
