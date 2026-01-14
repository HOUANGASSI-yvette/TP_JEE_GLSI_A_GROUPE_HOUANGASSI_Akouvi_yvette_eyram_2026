package com.banque.controller;

import com.banque.dto.CompteDTO;
import com.banque.service.CompteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comptes")
@RequiredArgsConstructor
public class CompteController {
    
    private final CompteService compteService;
    
    @GetMapping
    public ResponseEntity<List<CompteDTO>> getAllComptes() {
        try {
            return ResponseEntity.ok(compteService.getAllComptes());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CompteDTO> getCompteById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(compteService.getCompteById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<CompteDTO>> getComptesByClient(@PathVariable Long clientId) {
        try {
            return ResponseEntity.ok(compteService.getComptesByClient(clientId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<CompteDTO> createCompte(@RequestBody CompteDTO compteDTO) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(compteService.createCompte(compteDTO));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("non trouvé")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CompteDTO> updateCompte(@PathVariable Long id, @RequestBody CompteDTO compteDTO) {
        try {
            return ResponseEntity.ok(compteService.updateCompte(id, compteDTO));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("non trouvé")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompte(@PathVariable Long id) {
        try {
            compteService.deleteCompte(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
