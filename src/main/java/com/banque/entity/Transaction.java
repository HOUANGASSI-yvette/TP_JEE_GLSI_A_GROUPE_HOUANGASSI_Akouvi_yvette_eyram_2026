package com.banque.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type_transaction", nullable = false)
    private TypeTransaction typeTransaction;
    
    @Column(nullable = false)
    private BigDecimal montant;
    
    @Column(name = "date_transaction", nullable = false)
    private LocalDateTime dateTransaction;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_compte_source", nullable = false)
    private Compte compteSource;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_compte_destination", nullable = true)
    private Compte compteDestination;
    
    @Column(length = 500)
    private String description;
}

