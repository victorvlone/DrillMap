package com.drillmap.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.drillmap.backend.entities.Favoritos;

public interface  FavoritosRepository extends JpaRepository<Favoritos, Integer> {

    Optional<Favoritos> findByUsuarioIdAndPocoId(String id_usuario, Integer pocoId);
    List<Favoritos> findByUsuarioId(String id_usuario);
}
