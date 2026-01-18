export enum TypeTransaction {
  DEPOT = 'DEPOT',
  RETRAIT = 'RETRAIT',
  TRANSFERT = 'TRANSFERT'
}

export interface Transaction {
  id?: number;
  typeTransaction: TypeTransaction;
  montant: number;
  dateTransaction: string;
  compteSourceId?: number;
  compteDestinationId?: number;
  description?: string;
}

