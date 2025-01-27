package com.drillmap.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.drillmap.backend.entities.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

}
