package com.colegiolavictoria.signoaventura.security.filters;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


import org.springframework.http.HttpStatus;


 
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.colegiolavictoria.signoaventura.modelos.Usuario;
import com.colegiolavictoria.signoaventura.security.jwt.JwtUtils;
import com.fasterxml.jackson.core.exc.StreamReadException;
import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter{

    private JwtUtils jwtUtils; 

    public JwtAuthenticationFilter(JwtUtils _JwtUtils){
        this.jwtUtils = _JwtUtils; 
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request,
                                         HttpServletResponse response) throws AuthenticationException {
        Usuario usuario = null; 
        String username; 
        String password; 
        try {
            usuario = new ObjectMapper().readValue(request.getInputStream(), Usuario.class);
            username = usuario.getUsuario(); 
            password = usuario.getContrasenia(); 

        } catch(StreamReadException e){
            throw new RuntimeException(e); 

        } catch (DatabindException e) {
                e.printStackTrace();
             throw new RuntimeException(e); 
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e);  
        }

        UsernamePasswordAuthenticationToken authenticationToken = 
                        new UsernamePasswordAuthenticationToken(username, password); 
        
        return getAuthenticationManager().authenticate(authenticationToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, 
                                         HttpServletResponse response, 
                                         FilterChain chain,
                                         Authentication authResult) throws IOException, ServletException {
        
        
        User user = (User) authResult.getPrincipal(); 
        String token = jwtUtils.generatedAccesToken(user.getUsername()); 

        response.addHeader("Authorization", token);
        Map<String, Object> httpResponse = new HashMap<>(); 
        httpResponse.put("token", token); 
        httpResponse.put("Message", "Autenticacion Correcta"); 
        httpResponse.put("username", user.getUsername()); 

        response.getWriter().write(new ObjectMapper().writeValueAsString(httpResponse));
        response.setStatus(HttpStatus.OK.value());
        response.setContentType(org.springframework.http.MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().flush();

        super.successfulAuthentication(request, response, chain, authResult);
    }

}
