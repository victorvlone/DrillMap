package com.drillmap.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.drillmap.backend.entities.Favoritos;
import com.drillmap.backend.repositories.FavoritosRepository;

@Service
public class FavoritosService {
    
    @Autowired
    private FavoritosRepository favoritosRepository;

    public Favoritos favoritar(Favoritos favorito) {
        Optional<Favoritos> existente = favoritosRepository
            .findByUsuarioIdAndPocoId(favorito.getUsuario().getId(), favorito.getPoco().getId());

        if (existente.isPresent()) {
            return existente.get();
        }

        return favoritosRepository.save(favorito);
    }

    public List<Favoritos> listarFavoritos(String id){
        return favoritosRepository.findByUsuarioId(id);
    }

    public Optional<Favoritos> removerFavorito(Integer id){
        Optional<Favoritos> favorito = favoritosRepository.findById(id);
        favorito.ifPresent(favoritosRepository::delete);
        return favorito;
    }
}
