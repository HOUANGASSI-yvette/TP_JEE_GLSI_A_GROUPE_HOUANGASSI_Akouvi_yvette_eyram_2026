import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Compte } from '../models/compte.model';

@Injectable({
  providedIn: 'root'
})
export class CompteService {
  private apiUrl = 'http://localhost:8080/api/comptes';

  constructor(private http: HttpClient) {}

  getAllComptes(): Observable<Compte[]> {
    return this.http.get<Compte[]>(this.apiUrl).pipe(
      map(comptes => comptes || []),
      catchError(this.handleError)
    );
  }

  getCompteById(id: number): Observable<Compte> {
    return this.http.get<Compte>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getComptesByClient(clientId: number): Observable<Compte[]> {
    return this.http.get<Compte[]>(`${this.apiUrl}/client/${clientId}`).pipe(
      map(comptes => comptes || []),
      catchError(this.handleError)
    );
  }

  createCompte(compte: Compte): Observable<Compte> {
    return this.http.post<Compte>(this.apiUrl, compte).pipe(
      catchError(this.handleError)
    );
  }

  updateCompte(id: number, compte: Compte): Observable<Compte> {
    return this.http.put<Compte>(`${this.apiUrl}/${id}`, compte).pipe(
      catchError(this.handleError)
    );
  }

  deleteCompte(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur réseau: ${error.error.message}`;
    } else {
      // Erreur côté serveur - extraire le message du body si disponible
      const serverMessage = error.error?.message || error.error?.error?.message;
      
      switch (error.status) {
        case 0:
          errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur le port 8080.';
          break;
        case 400:
          errorMessage = serverMessage || 'Requête invalide. Vérifiez que tous les champs sont correctement remplis.';
          break;
        case 404:
          errorMessage = serverMessage || 'Ressource non trouvée (client ou compte introuvable)';
          break;
        case 401:
          errorMessage = 'Non autorisé - Veuillez vous reconnecter';
          break;
        case 403:
          errorMessage = 'Accès interdit';
          break;
        case 409:
          errorMessage = serverMessage || 'Un compte avec ce numéro existe déjà';
          break;
        case 500:
          errorMessage = serverMessage || 'Erreur serveur interne. Vérifiez les logs du serveur.';
          break;
        default:
          errorMessage = serverMessage || `Erreur ${error.status}: ${error.message || 'Erreur inconnue'}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  };
}

