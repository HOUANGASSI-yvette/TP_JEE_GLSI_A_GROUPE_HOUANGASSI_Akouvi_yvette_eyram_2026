package com.banque.controller;

import com.banque.dto.TransactionDTO;
import com.banque.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    
    private final TransactionService transactionService;
    
    @PostMapping("/depot")
    public ResponseEntity<TransactionDTO> effectuerDepot(
            @RequestParam Long compteId,
            @RequestParam BigDecimal montant,
            @RequestParam(required = false) String description) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(transactionService.effectuerDepot(compteId, montant, description));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("non trouvé")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/retrait")
    public ResponseEntity<TransactionDTO> effectuerRetrait(
            @RequestParam Long compteId,
            @RequestParam BigDecimal montant,
            @RequestParam(required = false) String description) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(transactionService.effectuerRetrait(compteId, montant, description));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("non trouvé")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            if (e.getMessage().contains("Solde insuffisant")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/transfert")
    public ResponseEntity<TransactionDTO> effectuerTransfert(
            @RequestParam Long compteSourceId,
            @RequestParam Long compteDestinationId,
            @RequestParam BigDecimal montant,
            @RequestParam(required = false) String description) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(transactionService.effectuerTransfert(compteSourceId, compteDestinationId, montant, description));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("non trouvé")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            if (e.getMessage().contains("Solde insuffisant") || e.getMessage().contains("doivent être différents")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/compte/{compteId}")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByCompte(@PathVariable Long compteId) {
        try {
            return ResponseEntity.ok(transactionService.getTransactionsByCompte(compteId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO> getTransactionById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(transactionService.getTransactionById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getAllTransactions() {
        try {
            return ResponseEntity.ok(transactionService.getAllTransactions());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

