package com.drillmap.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.drillmap.backend.entities.Favoritos;
import com.drillmap.backend.repositories.FavoritosRepository;

/**
 * Serviço responsável pelas operações relacionadas aos favoritos dos usuários.
 */
@Service
public class FavoritosService {
    
    // Injeta o repositório de Favoritos para acesso ao banco de dados
    @Autowired
    private FavoritosRepository favoritosRepository;

    /**
     * Adiciona um poço aos favoritos do usuário, caso ainda não esteja favoritado.
     * Se já existir, retorna o favorito existente.
     * 
     * @param favorito Objeto Favoritos a ser salvo
     * @return Favoritos salvo ou já existente
     */
    public Favoritos favoritar(Favoritos favorito) {
        // Verifica se já existe favorito para o mesmo usuário e poço
        Optional<Favoritos> existente = favoritosRepository
            .findByUsuarioIdAndPocoId(favorito.getUsuario().getId(), favorito.getPoco().getId());

        // Se já existe, retorna o favorito existente
        if (existente.isPresent()) {
            return existente.get();
        }

        // Caso contrário, salva o novo favorito
        return favoritosRepository.save(favorito);
    }

    /**
     * Lista todos os favoritos de um usuário.
     * 
     * @param id ID do usuário
     * @return Lista de Favoritos do usuário
     */
    public List<Favoritos> listarFavoritos(String id){
        return favoritosRepository.findByUsuarioId(id);
    }

    /**
     * Remove um favorito pelo seu ID.
     * 
     * @param id ID do favorito
     * @return Optional contendo o favorito removido, se existir
     */
    public Optional<Favoritos> removerFavorito(Integer id){
        Optional<Favoritos> favorito = favoritosRepository.findById(id);
        favorito.ifPresent(favoritosRepository::delete);
        return favorito;
    }
}
