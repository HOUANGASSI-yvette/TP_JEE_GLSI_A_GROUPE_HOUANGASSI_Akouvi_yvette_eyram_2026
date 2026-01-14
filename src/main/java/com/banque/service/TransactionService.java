package com.banque.service;

import com.banque.dto.TransactionDTO;
import java.util.List;

public interface TransactionService {
    TransactionDTO effectuerDepot(Long compteId, java.math.BigDecimal montant, String description);
    TransactionDTO effectuerRetrait(Long compteId, java.math.BigDecimal montant, String description);
    TransactionDTO effectuerTransfert(Long compteSourceId, Long compteDestinationId, java.math.BigDecimal montant, String description);
    List<TransactionDTO> getTransactionsByCompte(Long compteId);
    TransactionDTO getTransactionById(Long id);
    List<TransactionDTO> getAllTransactions();
}

