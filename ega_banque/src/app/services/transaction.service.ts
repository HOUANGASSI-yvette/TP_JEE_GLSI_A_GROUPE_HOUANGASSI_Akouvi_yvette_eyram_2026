import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:8080/api/transactions';

  constructor(private http: HttpClient) {}

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl).pipe(
      map(transactions => transactions || []),
      catchError(this.handleError)
    );
  }

  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getTransactionsByCompte(compteId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/compte/${compteId}`).pipe(
      map(transactions => transactions || []),
      catchError(this.handleError)
    );
  }

  effectuerDepot(compteId: number, montant: number, description?: string): Observable<Transaction> {
    let params = new HttpParams()
      .set('compteId', compteId.toString())
      .set('montant', montant.toString());
    if (description) {
      params = params.set('description', description);
    }
    return this.http.post<Transaction>(`${this.apiUrl}/depot`, null, { params }).pipe(
      catchError(this.handleError)
    );
  }

  effectuerRetrait(compteId: number, montant: number, description?: string): Observable<Transaction> {
    let params = new HttpParams()
      .set('compteId', compteId.toString())
      .set('montant', montant.toString());
    if (description) {
      params = params.set('description', description);
    }
    return this.http.post<Transaction>(`${this.apiUrl}/retrait`, null, { params }).pipe(
      catchError(this.handleError)
    );
  }

  effectuerTransfert(compteSourceId: number, compteDestinationId: number, montant: number, description?: string): Observable<Transaction> {
    let params = new HttpParams()
      .set('compteSourceId', compteSourceId.toString())
      .set('compteDestinationId', compteDestinationId.toString())
      .set('montant', montant.toString());
    if (description) {
      params = params.set('description', description);
    }
    return this.http.post<Transaction>(`${this.apiUrl}/transfert`, null, { params }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur réseau: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 0:
          errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur le port 8080.';
          break;
        case 400:
          errorMessage = error.error?.message || 'Requête invalide';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée';
          break;
        case 401:
          errorMessage = 'Non autorisé - Veuillez vous reconnecter';
          break;
        case 403:
          errorMessage = 'Accès interdit';
          break;
        case 500:
          errorMessage = error.error?.message || 'Erreur serveur interne';
          break;
        default:
          errorMessage = error.error?.message || `Erreur ${error.status}: ${error.message || 'Erreur inconnue'}`;
      }
    }
    
    console.error('TransactionService Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  };
}

