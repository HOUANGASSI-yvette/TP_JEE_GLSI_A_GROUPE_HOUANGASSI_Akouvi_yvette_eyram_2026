package com.banque.service;

import com.banque.dto.ClientDTO;
import java.util.List;

public interface ClientService {
    List<ClientDTO> getAllClients();
    ClientDTO getClientById(Long id);
    ClientDTO createClient(ClientDTO clientDTO);
    ClientDTO updateClient(Long id, ClientDTO clientDTO);
    void deleteClient(Long id);
}
