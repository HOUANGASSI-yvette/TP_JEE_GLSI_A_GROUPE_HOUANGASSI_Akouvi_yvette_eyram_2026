export enum TypeCompte {
  COURANT = 'COURANT',
  EPARGNE = 'EPARGNE'
}

export interface Compte {
  id?: number;
  numCompte?: string; // Optionnel car généré automatiquement par l'IBAN côté backend
  typeCompte: TypeCompte;
  solde: number;
  clientId: number;
}

