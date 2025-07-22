package com.colegiolavictoria.signoaventura.security.jwt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtUtils {

    @Value("${jwt.secret.key}")
    private String secretKey; 
    
    @Value("${jwt.time.expiration}")
    private String timeExpiration;
    
    //generar token de acceso
    public String generatedAccesToken(String userName){
        return Jwts.builder()
                .setSubject(userName)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + Long.parseLong(timeExpiration)) )
                .signWith(getSignatureKey(), SignatureAlgorithm.HS256)
                .compact(); 
    }

    //validar si el token es valido
    public boolean isTokenValid(String token){
        try {
            
            Jwts.parserBuilder()
                .setSigningKey(getSignatureKey())
                .build()
                .parseClaimsJws(token)
                .getBody(); 
            return true; 

        } catch (Exception e) {
            log.error("token invalido, error: ".concat(e.getMessage()));

            return false; 
        }

    }

    //obtener todos los claims del token
    public Claims extractAlClaims(String token){

        return  Jwts.parserBuilder()
                .setSigningKey(getSignatureKey())
                .build()
                .parseClaimsJws(token)
                .getBody(); 
    }

    //obtenr el username del token
    public String getUsernameFromToken(String token){
        return getClaim(token, Claims::getSubject); 

    }

    //obtener un solo claim
    public <T> T getClaim(String token, Function<Claims, T> claimsTFunction){
        Claims claim = extractAlClaims(token); 
        return claimsTFunction.apply(claim); 
    }

    //obtener firma del token 
    public Key getSignatureKey(){
        byte[] keyBytes = Decoders.BASE64.decode(secretKey); 

        return Keys.hmacShaKeyFor(keyBytes); 
    }

}
