package com.banque.service.impl;

import com.banque.dto.TransactionDTO;
import com.banque.entity.Compte;
import com.banque.entity.Transaction;
import com.banque.entity.TypeTransaction;
import com.banque.repository.CompteRepository;
import com.banque.repository.TransactionRepository;
import com.banque.service.TransactionService;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
    
    private final TransactionRepository transactionRepository;
    private final CompteRepository compteRepository;
    private final EntityManager entityManager;
    
    // Méthode privée pour convertir Entity vers DTO
    private TransactionDTO toDTO(Transaction transaction) {
        if (transaction == null) {
            return null;
        }
        return new TransactionDTO(
            transaction.getId(),
            transaction.getTypeTransaction(),
            transaction.getMontant(),
            transaction.getDateTransaction(),
            transaction.getCompteSource() != null ? transaction.getCompteSource().getId() : null,
            transaction.getCompteDestination() != null ? transaction.getCompteDestination().getId() : null,
            transaction.getDescription()
        );
    }
    
    @Override
    public TransactionDTO effectuerDepot(Long compteId, BigDecimal montant, String description) {
        // Vérifier que le montant est positif
        if (montant == null || montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Le montant doit être supérieur à zéro");
        }
        
        // Récupérer le compte
        Compte compte = compteRepository.findById(compteId)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé avec l'ID: " + compteId));
        
        // Effectuer le dépôt (augmenter le solde)
        BigDecimal nouveauSolde = compte.getSolde().add(montant);
        compte.setSolde(nouveauSolde);
        compteRepository.save(compte);
        entityManager.flush();
        
        // Créer la transaction
        Transaction transaction = new Transaction();
        transaction.setTypeTransaction(TypeTransaction.DEPOT);
        transaction.setMontant(montant);
        transaction.setDateTransaction(LocalDateTime.now());
        transaction.setCompteSource(compte);
        transaction.setCompteDestination(null);
        transaction.setDescription(description != null ? description : "Dépôt sur le compte");
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        entityManager.flush();
        
        return toDTO(savedTransaction);
    }
    
    @Override
    public TransactionDTO effectuerRetrait(Long compteId, BigDecimal montant, String description) {
        // Vérifier que le montant est positif
        if (montant == null || montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Le montant doit être supérieur à zéro");
        }
        
        // Récupérer le compte
        Compte compte = compteRepository.findById(compteId)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé avec l'ID: " + compteId));
        
        // Vérifier que le solde est suffisant
        if (compte.getSolde().compareTo(montant) < 0) {
            throw new RuntimeException("Solde insuffisant. Solde actuel: " + compte.getSolde());
        }
        
        // Effectuer le retrait (diminuer le solde)
        BigDecimal nouveauSolde = compte.getSolde().subtract(montant);
        compte.setSolde(nouveauSolde);
        compteRepository.save(compte);
        entityManager.flush();
        
        // Créer la transaction
        Transaction transaction = new Transaction();
        transaction.setTypeTransaction(TypeTransaction.RETRAIT);
        transaction.setMontant(montant);
        transaction.setDateTransaction(LocalDateTime.now());
        transaction.setCompteSource(compte);
        transaction.setCompteDestination(null);
        transaction.setDescription(description != null ? description : "Retrait du compte");
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        entityManager.flush();
        
        return toDTO(savedTransaction);
    }
    
    @Override
    public TransactionDTO effectuerTransfert(Long compteSourceId, Long compteDestinationId, BigDecimal montant, String description) {
        // Vérifier que le montant est positif
        if (montant == null || montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Le montant doit être supérieur à zéro");
        }
        
        // Vérifier que les comptes sont différents
        if (compteSourceId.equals(compteDestinationId)) {
            throw new RuntimeException("Le compte source et le compte destination doivent être différents");
        }
        
        // Récupérer les comptes
        Compte compteSource = compteRepository.findById(compteSourceId)
                .orElseThrow(() -> new RuntimeException("Compte source non trouvé avec l'ID: " + compteSourceId));
        
        Compte compteDestination = compteRepository.findById(compteDestinationId)
                .orElseThrow(() -> new RuntimeException("Compte destination non trouvé avec l'ID: " + compteDestinationId));
        
        // Vérifier que le solde du compte source est suffisant
        if (compteSource.getSolde().compareTo(montant) < 0) {
            throw new RuntimeException("Solde insuffisant sur le compte source. Solde actuel: " + compteSource.getSolde());
        }
        
        // Effectuer le transfert
        BigDecimal nouveauSoldeSource = compteSource.getSolde().subtract(montant);
        BigDecimal nouveauSoldeDestination = compteDestination.getSolde().add(montant);
        
        compteSource.setSolde(nouveauSoldeSource);
        compteDestination.setSolde(nouveauSoldeDestination);
        
        compteRepository.save(compteSource);
        compteRepository.save(compteDestination);
        entityManager.flush();
        
        // Créer la transaction
        Transaction transaction = new Transaction();
        transaction.setTypeTransaction(TypeTransaction.TRANSFERT);
        transaction.setMontant(montant);
        transaction.setDateTransaction(LocalDateTime.now());
        transaction.setCompteSource(compteSource);
        transaction.setCompteDestination(compteDestination);
        transaction.setDescription(description != null ? description : 
            "Transfert de " + compteSource.getNumCompte() + " vers " + compteDestination.getNumCompte());
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        entityManager.flush();
        
        return toDTO(savedTransaction);
    }
    
    @Override
    public List<TransactionDTO> getTransactionsByCompte(Long compteId) {
        Compte compte = compteRepository.findById(compteId)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé avec l'ID: " + compteId));
        
        return transactionRepository.findByCompteSourceOrCompteDestination(compte, compte)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public TransactionDTO getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction non trouvée avec l'ID: " + id));
        return toDTO(transaction);
    }
    
    @Override
    public List<TransactionDTO> getAllTransactions() {
        return transactionRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}

