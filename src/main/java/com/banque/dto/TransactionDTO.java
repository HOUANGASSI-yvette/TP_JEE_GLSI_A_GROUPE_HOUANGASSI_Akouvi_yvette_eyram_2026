package com.banque.dto;

import com.banque.entity.TypeTransaction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    private Long id;
    private TypeTransaction typeTransaction;
    private BigDecimal montant;
    private LocalDateTime dateTransaction;
    private Long compteSourceId;
    private Long compteDestinationId;
    private String description;
}

