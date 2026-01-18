package com.backend.ega.controllers;

import com.backend.ega.entities.Admin;
import com.backend.ega.services.AdminsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admins")
public class AdminsController {

    private final AdminsService adminsService;

    public AdminsController(AdminsService adminsService) {
        this.adminsService = adminsService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Admin> getAdminById(@PathVariable Long id) {
        return adminsService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Admin> updateAdmin(@PathVariable Long id, @RequestBody Admin adminDetails) {
        return adminsService.findById(id)
                .map(admin -> {
                    admin.setFirstName(adminDetails.getFirstName());
                    admin.setLastName(adminDetails.getLastName());
                    admin.setEmail(adminDetails.getEmail());
                    admin.setUsername(adminDetails.getUsername());
                    return ResponseEntity.ok(adminsService.saveAdmin(admin));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
