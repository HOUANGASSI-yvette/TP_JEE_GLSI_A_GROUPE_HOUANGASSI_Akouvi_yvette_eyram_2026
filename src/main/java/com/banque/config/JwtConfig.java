package com.banque.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "jwt")
@Data
public class JwtConfig {
    private String secret = "mySecretKeyForJWTTokenGenerationThatIsAtLeast256BitsLongForHS512Algorithm";
    private long expiration = 86400000; // 24 heures en millisecondes
}

