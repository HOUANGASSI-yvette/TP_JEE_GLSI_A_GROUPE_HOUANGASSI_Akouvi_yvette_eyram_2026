package com.banque.service.impl;

import com.banque.dto.CompteDTO;
import com.banque.entity.Client;
import com.banque.entity.Compte;
import com.banque.repository.ClientRepository;
import com.banque.repository.CompteRepository;
import com.banque.service.CompteService;
import lombok.RequiredArgsConstructor;
import org.iban4j.CountryCode;
import org.iban4j.Iban;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CompteServiceImpl implements CompteService {
    
    private final CompteRepository compteRepository;
    private final ClientRepository clientRepository;
    
    private static final Random random = new Random();
    private static final String BANK_CODE = "12345"; // Code banque fictif
    
    // Méthode privée pour générer un IBAN français unique
    private String generateIban() {
        String iban = null;
        boolean isUnique = false;
        int attempts = 0;
        int maxAttempts = 100;
        
        do {
            // Générer un numéro de compte aléatoire (11 chiffres pour la France)
            String accountNumber = String.format("%011d", Math.abs(random.nextLong() % 100000000000L));
            
            try {
                // Construire un IBAN français valide
                Iban ibanObj = new Iban.Builder()
                        .countryCode(CountryCode.FR)
                        .bankCode(BANK_CODE)
                        .accountNumber(accountNumber)
                        .build();
                
                iban = ibanObj.toString();
                
                // Vérifier l'unicité
                isUnique = !compteRepository.findByNumCompte(iban).isPresent();
                attempts++;
                
                if (attempts >= maxAttempts) {
                    throw new RuntimeException("Impossible de générer un IBAN unique après " + maxAttempts + " tentatives");
                }
            } catch (Exception e) {
                attempts++;
                if (attempts >= maxAttempts) {
                    throw new RuntimeException("Erreur lors de la génération de l'IBAN: " + e.getMessage());
                }
                continue;
            }
        } while (!isUnique);
        
        if (iban == null) {
            throw new RuntimeException("Impossible de générer un IBAN valide");
        }
        
        return iban;
    }
    
    // Méthode privée pour convertir Entity vers DTO
    private CompteDTO toDTO(Compte compte) {
        if (compte == null) {
            return null;
        }
        return new CompteDTO(
            compte.getId(),
            compte.getNumCompte(),
            compte.getTypeCompte(),
            compte.getSolde(),
            compte.getClient() != null ? compte.getClient().getId() : null
        );
    }
    
    @Override
    public List<CompteDTO> getAllComptes() {
        return compteRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public CompteDTO getCompteById(Long id) {
        Compte compte = compteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé avec l'ID: " + id));
        return toDTO(compte);
    }
    
    @Override
    public List<CompteDTO> getComptesByClient(Long clientId) {
        return compteRepository.findByClientId(clientId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public CompteDTO createCompte(CompteDTO compteDTO) {
        // Vérifier si le client existe
        Client client = clientRepository.findById(compteDTO.getClientId())
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'ID: " + compteDTO.getClientId()));
        
        // Générer automatiquement un IBAN si non fourni
        String numCompte;
        if (compteDTO.getNumCompte() == null || compteDTO.getNumCompte().trim().isEmpty()) {
            numCompte = generateIban();
        } else {
            // Vérifier si le numéro de compte fourni existe déjà
            if (compteRepository.findByNumCompte(compteDTO.getNumCompte()).isPresent()) {
                throw new RuntimeException("Un compte avec ce numéro existe déjà");
            }
            // Valider le format IBAN si fourni
            try {
                Iban.valueOf(compteDTO.getNumCompte());
                numCompte = compteDTO.getNumCompte();
            } catch (Exception e) {
                throw new RuntimeException("Le numéro de compte fourni n'est pas un IBAN valide");
            }
        }
        
        Compte compte = new Compte(null, numCompte, compteDTO.getTypeCompte(), compteDTO.getSolde(), client);
        Compte savedCompte = compteRepository.save(compte);
        return toDTO(savedCompte);
    }
    
    @Override
    public CompteDTO updateCompte(Long id, CompteDTO compteDTO) {
        Compte compte = compteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé avec l'ID: " + id));
        
        // Mettre à jour le numéro de compte si fourni et différent
        if (compteDTO.getNumCompte() != null && !compteDTO.getNumCompte().trim().isEmpty()) {
            if (!compte.getNumCompte().equals(compteDTO.getNumCompte())) {
                // Vérifier si le nouveau numéro existe déjà
                if (compteRepository.findByNumCompte(compteDTO.getNumCompte()).isPresent()) {
                    throw new RuntimeException("Un compte avec ce numéro existe déjà");
                }
                // Valider le format IBAN
                try {
                    Iban.valueOf(compteDTO.getNumCompte());
                    compte.setNumCompte(compteDTO.getNumCompte());
                } catch (Exception e) {
                    throw new RuntimeException("Le numéro de compte fourni n'est pas un IBAN valide");
                }
            }
        }
        
        compte.setTypeCompte(compteDTO.getTypeCompte());
        compte.setSolde(compteDTO.getSolde());
        
        // Mettre à jour le client si fourni
        if (compteDTO.getClientId() != null && !compte.getClient().getId().equals(compteDTO.getClientId())) {
            Client client = clientRepository.findById(compteDTO.getClientId())
                    .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'ID: " + compteDTO.getClientId()));
            compte.setClient(client);
        }
        
        Compte updatedCompte = compteRepository.save(compte);
        return toDTO(updatedCompte);
    }
    
    @Override
    public void deleteCompte(Long id) {
        if (!compteRepository.existsById(id)) {
            throw new RuntimeException("Compte non trouvé avec l'ID: " + id);
        }
        compteRepository.deleteById(id);
    }
}
