# Authentification et Optimisations - Ega Banque

## 🔐 Authentification JWT

L'application utilise maintenant l'authentification JWT (JSON Web Token) pour sécuriser l'accès à l'API.

### Comptes par défaut

Au démarrage de l'application, deux comptes sont créés automatiquement :

- **Admin** : `username: admin`, `password: admin123`
- **User** : `username: user`, `password: user123`

### Utilisation

1. **Connexion** : Accédez à `/login` pour vous connecter
2. **Inscription** : Cliquez sur "Créer un compte" pour créer un nouveau compte
3. **Déconnexion** : Utilisez le bouton "Déconnexion" dans la barre de navigation

### Sécurité
ad
- Tous les endpoints API (sauf `/api/auth/**`) nécessitent un token JWT valide
- Le token est stocké dans le localStorage
- Le token expire après 24 heures
- En cas d'erreur 401, l'utilisateur est automatiquement déconnecté

## ⚡ Optimisations de Performance

### Caching

Les services `ClientService` et `CompteService` utilisent maintenant un système de cache :
- **Durée du cache** : 30 secondes
- **Invalidation automatique** : Le cache est invalidé lors des opérations CREATE, UPDATE, DELETE
- **Force refresh** : Possibilité de forcer le rafraîchissement avec `getAllClients(true)`

### Gestion des erreurs

- Messages d'erreur clairs et spécifiques selon le code HTTP
- Gestion automatique des erreurs 401 (déconnexion)
- Logging des erreurs pour le débogage

## 🚀 Configuration CORS

Le backend est configuré pour accepter les requêtes depuis `http://localhost:4200`.

## 📝 Notes importantes

1. **Redémarrage nécessaire** : Après avoir ajouté les dépendances Maven, vous devez :
   ```bash
   mvn clean install
   ```

2. **Base de données** : Les utilisateurs par défaut sont créés automatiquement au premier démarrage

3. **Token JWT** : Le secret JWT est défini dans `JwtConfig.java`. En production, utilisez une clé sécurisée.

## 🔧 Dépannage

### Les données ne se chargent pas

1. Vérifiez que le backend Spring Boot est démarré sur le port 8080
2. Vérifiez la console du navigateur pour les erreurs CORS
3. Vérifiez que vous êtes connecté (token JWT présent)

### Erreur 401 (Non autorisé)

- Votre token a peut-être expiré, reconnectez-vous
- Vérifiez que le token est bien envoyé dans les headers

### L'application est lente

- Le cache devrait améliorer les performances
- Vérifiez la connexion réseau
- Vérifiez les logs du backend pour identifier les requêtes lentes

