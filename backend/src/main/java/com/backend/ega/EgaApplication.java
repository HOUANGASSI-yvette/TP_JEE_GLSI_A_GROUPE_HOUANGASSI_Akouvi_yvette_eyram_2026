package com.backend.ega;

import com.backend.ega.entities.Admin;
import com.backend.ega.services.AdminsService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@SpringBootApplication
public class EgaApplication {

    public static void main(String[] args) {
        SpringApplication.run(EgaApplication.class, args);
    }

    @Bean
    public CommandLineRunner initAdmin(AdminsService adminsService, PasswordEncoder passwordEncoder) {
        return args -> {
            Optional<Admin> adminOpt = adminsService.findByEmail("admin@ega.com");
            if (adminOpt.isPresent()) {
                Admin admin = adminOpt.get();
                admin.setPassword(passwordEncoder.encode("admin123"));
                adminsService.saveAdmin(admin);
                System.out.println("⚠️ Admin password RESET to: admin123");
            } else {
                adminsService.createAdmin(
                        "admin",
                        "admin@ega.com",
                        "admin123",
                        "System",
                        "Administrator");
                System.out.println("✅ Default admin user created: admin@ega.com / admin123");
            }
        };
    }
}
