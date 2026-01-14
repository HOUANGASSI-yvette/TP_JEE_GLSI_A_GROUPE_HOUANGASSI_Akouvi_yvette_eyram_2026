package com.banque.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "clients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Client {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nom;
    
    @Column(nullable = false)
    private String prenom;
    
    @Column(name = "date_naissance", nullable = false)
    private LocalDate dateNaissance;
    
    @Column(nullable = false)
    private String sexe;
    
    @Column(nullable = false, unique = true)
    private String courriel;
    
    @Column(nullable = false)
    private String adresse;
    
    @Column(name = "num_telephone", nullable = false)
    private String numTelephone;
    
    @Column(nullable = false)
    private String nationalite;
    
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Compte> comptes;
}
