package com.banque.dto;

import com.banque.entity.TypeCompte;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompteDTO {
    private Long id;
    private String numCompte;
    private TypeCompte typeCompte;
    private BigDecimal solde;
    private Long clientId;
}
