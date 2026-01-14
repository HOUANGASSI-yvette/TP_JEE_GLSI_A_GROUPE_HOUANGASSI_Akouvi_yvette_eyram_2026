package com.banque.repository;

import com.banque.entity.Compte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompteRepository extends JpaRepository<Compte, Long> {
    Optional<Compte> findByNumCompte(String numCompte);
    List<Compte> findByClientId(Long clientId);
}
