package com.banque.repository;

import com.banque.entity.Transaction;
import com.banque.entity.Compte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByCompteSource(Compte compte);
    
    List<Transaction> findByCompteDestination(Compte compte);
    
    List<Transaction> findByCompteSourceOrCompteDestination(Compte compteSource, Compte compteDestination);
}

