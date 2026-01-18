package com.banque.service.impl;

import com.banque.dto.ClientDTO;
import com.banque.entity.Client;
import com.banque.repository.ClientRepository;
import com.banque.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {
    
    private final ClientRepository clientRepository;
    
    // Méthode privée pour convertir Entity vers DTO
    private ClientDTO toDTO(Client client) {
        if (client == null) {
            return null;
        }
        return new ClientDTO(
            client.getId(),
            client.getNom(),
            client.getPrenom(),
            client.getDateNaissance(),
            client.getSexe(),
            client.getCourriel(),
            client.getAdresse(),
            client.getNumTelephone(),
            client.getNationalite()
        );
    }
    
    // Méthode privée pour convertir DTO vers Entity
    private Client toEntity(ClientDTO dto) {
        if (dto == null) {
            return null;
        }
        Client client = new Client();
        client.setId(dto.getId());
        client.setNom(dto.getNom());
        client.setPrenom(dto.getPrenom());
        client.setDateNaissance(dto.getDateNaissance());
        client.setSexe(dto.getSexe());
        client.setCourriel(dto.getCourriel());
        client.setAdresse(dto.getAdresse());
        client.setNumTelephone(dto.getNumTelephone());
        client.setNationalite(dto.getNationalite());
        return client;
    }
    
    @Override
    public List<ClientDTO> getAllClients() {
        return clientRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public ClientDTO getClientById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("L'ID du client ne peut pas être null");
        }
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'ID: " + id));
        return toDTO(client);
    }
    
    @Override
    public ClientDTO createClient(ClientDTO clientDTO) {
        if (clientDTO == null) {
            throw new IllegalArgumentException("Le client DTO ne peut pas être null");
        }
        // Vérifier si le courriel existe déjà
        if (clientRepository.findByCourriel(clientDTO.getCourriel()).isPresent()) {
            throw new RuntimeException("Un client avec ce courriel existe déjà");
        }
        
        Client client = toEntity(clientDTO);
        if (client == null) {
            throw new RuntimeException("Erreur lors de la conversion du client DTO en entité");
        }
        Client savedClient = clientRepository.save(client);
        return toDTO(savedClient);
    }
    
    @Override
    public ClientDTO updateClient(Long id, ClientDTO clientDTO) {
        if (id == null) {
            throw new IllegalArgumentException("L'ID du client ne peut pas être null");
        }
        Long clientId = id;
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'ID: " + clientId));
        
        // Vérifier si le courriel est modifié et s'il existe déjà
        if (!client.getCourriel().equals(clientDTO.getCourriel())) {
            if (clientRepository.findByCourriel(clientDTO.getCourriel()).isPresent()) {
                throw new RuntimeException("Un client avec ce courriel existe déjà");
            }
        }
        
        client.setNom(clientDTO.getNom());
        client.setPrenom(clientDTO.getPrenom());
        client.setDateNaissance(clientDTO.getDateNaissance());
        client.setSexe(clientDTO.getSexe());
        client.setCourriel(clientDTO.getCourriel());
        client.setAdresse(clientDTO.getAdresse());
        client.setNumTelephone(clientDTO.getNumTelephone());
        client.setNationalite(clientDTO.getNationalite());
        
        Client updatedClient = clientRepository.save(client);
        return toDTO(updatedClient);
    }
    
    @Override
    public void deleteClient(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("L'ID du client ne peut pas être null");
        }
        if (!clientRepository.existsById(id)) {
            throw new RuntimeException("Client non trouvé avec l'ID: " + id);
        }
        clientRepository.deleteById(id);
    }
}
