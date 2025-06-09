package com.drillmap.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.drillmap.backend.entities.Favoritos;

/**
 * Repositório para a entidade Favoritos.
 * Fornece métodos para operações de CRUD e consultas customizadas relacionadas aos favoritos dos usuários.
 */
public interface FavoritosRepository extends JpaRepository<Favoritos, Integer> {

    /**
     * Busca um favorito pelo ID do usuário e ID do poço.
     * 
     * @param id_usuario ID do usuário
     * @param pocoId ID do poço
     * @return Optional contendo o favorito, se encontrado
     */
    Optional<Favoritos> findByUsuarioIdAndPocoId(String id_usuario, Integer pocoId);

    /**
     * Busca todos os favoritos de um usuário pelo seu ID.
     * 
     * @param id_usuario ID do usuário
     * @return Lista de favoritos do usuário
     */
    List<Favoritos> findByUsuarioId(String id_usuario);
}
