import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginMode = true;
  error: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Si déjà authentifié, rediriger vers le dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.error = null;
    this.isLoading = false;
  }

  onLogin(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.error = null;
      this.isLoading = true;
      const credentials = this.loginForm.value;
      
      // Timeout pour éviter que le spinner tourne indéfiniment
      const timeout = setTimeout(() => {
        if (this.isLoading) {
          this.isLoading = false;
          this.error = 'Le serveur ne répond pas. Vérifiez que le backend Spring Boot est démarré sur le port 8080.';
        }
      }, 10000); // 10 secondes de timeout
      
      this.authService.login(credentials).subscribe({
        next: (response) => {
          clearTimeout(timeout);
          this.isLoading = false;
          if (response && response.token) {
            // Navigation simple sans reload
            this.router.navigate(['/dashboard']).catch(() => {
              this.error = 'Erreur de navigation';
            });
          } else {
            this.error = 'Réponse invalide du serveur';
          }
        },
        error: (err) => {
          clearTimeout(timeout);
          this.isLoading = false;
          if (err?.status === 0 || err?.message?.includes('connecter au serveur')) {
            this.error = 'Impossible de se connecter au serveur. Vérifiez que le backend Spring Boot est démarré sur le port 8080.';
          } else {
            this.error = err?.message || 'Nom d\'utilisateur ou mot de passe incorrect';
          }
        }
      });
    }
  }

  onRegister(): void {
    if (this.registerForm.valid && !this.isLoading) {
      this.error = null;
      this.isLoading = true;
      const credentials = this.registerForm.value;
      
      // Timeout pour éviter que le spinner tourne indéfiniment
      const timeout = setTimeout(() => {
        if (this.isLoading) {
          this.isLoading = false;
          this.error = 'Le serveur ne répond pas. Vérifiez que le backend Spring Boot est démarré sur le port 8080.';
        }
      }, 10000); // 10 secondes de timeout
      
      this.authService.register(credentials).subscribe({
        next: () => {
          clearTimeout(timeout);
          // Auto-login après inscription
          this.authService.login(credentials).subscribe({
            next: (loginResponse) => {
              this.isLoading = false;
              if (loginResponse && loginResponse.token) {
                this.router.navigate(['/dashboard']).catch(() => {
                  this.error = 'Erreur de navigation';
                });
              } else {
                this.error = 'Inscription réussie mais connexion échouée';
              }
            },
            error: (loginErr) => {
              this.isLoading = false;
              if (loginErr?.status === 0 || loginErr?.message?.includes('connecter au serveur')) {
                this.error = 'Impossible de se connecter au serveur. Vérifiez que le backend Spring Boot est démarré sur le port 8080.';
              } else {
                this.error = loginErr?.message || 'Erreur lors de la connexion après inscription';
              }
            }
          });
        },
        error: (err) => {
          clearTimeout(timeout);
          this.isLoading = false;
          if (err?.status === 0 || err?.message?.includes('connecter au serveur')) {
            this.error = 'Impossible de se connecter au serveur. Vérifiez que le backend Spring Boot est démarré sur le port 8080.';
          } else {
            this.error = err?.message || 'Le nom d\'utilisateur existe déjà ou une erreur est survenue';
          }
        }
      });
    }
  }
}

