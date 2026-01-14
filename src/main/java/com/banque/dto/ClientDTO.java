package com.banque.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientDTO {
    private Long id;
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private String sexe;
    private String courriel;
    private String adresse;
    private String numTelephone;
    private String nationalite;
}
