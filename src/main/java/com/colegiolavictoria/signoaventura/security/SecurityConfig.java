package com.colegiolavictoria.signoaventura.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.colegiolavictoria.signoaventura.security.filters.JwtAuthenticationFilter;
import com.colegiolavictoria.signoaventura.security.filters.JwtAutorizationFilter;
import com.colegiolavictoria.signoaventura.security.jwt.JwtUtils;
import com.colegiolavictoria.signoaventura.servicios.UserDetailsServiceImpl;



@Configuration
public class SecurityConfig {

    @Autowired
    UserDetailsServiceImpl userDetailsServiceImpl; 

    @Autowired
    JwtUtils jwtUtils;
    
    @Autowired
    JwtAutorizationFilter autorizationFilter; 
 
   @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationManager authenticationManager) throws Exception {
        JwtAuthenticationFilter jwtAuthenticationFilter = new JwtAuthenticationFilter(jwtUtils); 
        jwtAuthenticationFilter.setAuthenticationManager(authenticationManager);
        jwtAuthenticationFilter.setFilterProcessesUrl("/login");

        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> {
                auth.requestMatchers("/login").permitAll(); 
                auth.anyRequest().authenticated();
            })
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilter(jwtAuthenticationFilter)
            .addFilterBefore(autorizationFilter, UsernamePasswordAuthenticationFilter.class);
            

        return http.build(); // se devuelve al final
    }

    /*@Bean
    public UserDetailsService userDetailsService(){
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager(); 
        manager.createUser(User.withUsername("david")
            .password("123")
            .roles()
            .build()
        );
        return manager; 
    }*/

    @Bean 
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder(); 
    }

   @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, PasswordEncoder passwordEncoder, UserDetailsService userDetailsService) throws Exception {
        AuthenticationManagerBuilder authBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authBuilder
            .userDetailsService(userDetailsServiceImpl)
            .passwordEncoder(passwordEncoder);

        return authBuilder.build(); //
    }


}
