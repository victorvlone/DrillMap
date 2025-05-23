package com.drillmap.backend.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.drillmap.backend.entities.Usuario;
import com.drillmap.backend.repositories.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    public Usuario salvarUsuario(Usuario usuario){
        return repository.save(usuario);
    }

    public Optional<Usuario> usuarioPorId(String id){
        return repository.findById(id);
    }

}
