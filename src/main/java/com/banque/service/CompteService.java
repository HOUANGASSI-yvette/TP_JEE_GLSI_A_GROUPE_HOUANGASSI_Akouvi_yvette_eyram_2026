package com.banque.service;

import com.banque.dto.CompteDTO;
import java.util.List;

public interface CompteService {
    List<CompteDTO> getAllComptes();
    CompteDTO getCompteById(Long id);
    List<CompteDTO> getComptesByClient(Long clientId);
    CompteDTO createCompte(CompteDTO compteDTO);
    CompteDTO updateCompte(Long id, CompteDTO compteDTO);
    void deleteCompte(Long id);
}
