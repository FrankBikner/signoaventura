package com.colegiolavictoria.signoaventura.servicios;

import java.util.Collection;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.colegiolavictoria.signoaventura.modelos.Usuario;
import com.colegiolavictoria.signoaventura.repositorios.UsuarioRepositorio;


@Service
public class UserDetailsServiceImpl implements UserDetailsService{
    @Autowired
    private UsuarioRepositorio usuarioRepositorio; 

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

       Usuario usuario = usuarioRepositorio.findByUsuario(username)
                                    .orElseThrow(()-> new UsernameNotFoundException("el usuario " + username + "no existe "));
    
      Collection<? extends GrantedAuthority> authorities =  Stream
                                    .of(usuario.getRol())
                                    .map(role -> new SimpleGrantedAuthority("ROLE_".concat(role.getNombreRol().name())))
                                    .collect(Collectors.toSet()); 
                                                                  
      return new User(usuario.getUsuario(), 
                    usuario.getContrasenia(),
                    true, 
                    true, 
                    true, 
                    true, 
                    authorities);                        
    }


}
