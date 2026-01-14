package com.banque.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "comptes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Compte {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "num_compte", nullable = false, unique = true)
    private String numCompte;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type_compte", nullable = false)
    private TypeCompte typeCompte;
    
    @Column(nullable = false)
    private BigDecimal solde;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_client", nullable = false)
    private Client client;
}
