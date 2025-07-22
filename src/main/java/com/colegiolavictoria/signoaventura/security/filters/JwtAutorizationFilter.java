package com.colegiolavictoria.signoaventura.security.filters;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.colegiolavictoria.signoaventura.security.jwt.JwtUtils;
import com.colegiolavictoria.signoaventura.servicios.UserDetailsServiceImpl;

import io.micrometer.common.lang.NonNull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAutorizationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils; 

    @Autowired
    private UserDetailsServiceImpl userDetailsService; 

    @Override
    protected void doFilterInternal(
                    @NonNull HttpServletRequest request, 
                    @NonNull HttpServletResponse response, 
                    @NonNull FilterChain filterChain)
                         throws ServletException,IOException {
                            
         String tokenHeader = request.getHeader("Authorization");
         if(tokenHeader != null && tokenHeader.startsWith("Bearer ")){
            String token = tokenHeader.substring(7);
            
            if(jwtUtils.isTokenValid(token)){
                String username = jwtUtils.getUsernameFromToken(token); 
                UserDetails userDetails =  userDetailsService.loadUserByUsername(username); 
                UsernamePasswordAuthenticationToken authenticationToken = 
                            new UsernamePasswordAuthenticationToken(username, null, userDetails.getAuthorities()); 
                
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }

         }
         filterChain.doFilter(request, response);                    

             
    }

    

}
