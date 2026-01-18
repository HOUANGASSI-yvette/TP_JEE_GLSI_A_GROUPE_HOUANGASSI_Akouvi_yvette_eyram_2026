import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthRequest, AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'jwt_token';
  private currentUserSubject = new BehaviorSubject<string | null>(this.getUsername());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token);
          this.setUsername(response.username);
          this.currentUserSubject.next(response.username);
        }
      }),
      catchError(this.handleError)
    );
  }

  register(request: AuthRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, request).pipe(
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
        case 401:
          errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';
          break;
        case 403:
          errorMessage = 'Accès interdit';
          break;
        case 409:
          errorMessage = 'Le nom d\'utilisateur existe déjà';
          break;
        case 500:
          errorMessage = error.error?.message || 'Erreur serveur interne';
          break;
        default:
          errorMessage = error.error?.message || `Erreur ${error.status}: ${error.message || 'Erreur inconnue'}`;
      }
    }
    
    console.error('Auth Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  };

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('username');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUsername(username: string): void {
    localStorage.setItem('username', username);
  }

  private getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getCurrentUsername(): string | null {
    return this.currentUserSubject.value;
  }
}

