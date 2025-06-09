package com.drillmap.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.drillmap.backend.entities.Bacia;

/**
 * Repositório para a entidade Bacia.
 * Fornece métodos para operações de CRUD, consultas customizadas e suporte a Specifications.
 */
public interface BaciaRepository extends JpaRepository<Bacia, Integer>,  JpaSpecificationExecutor<Bacia> {

    /**
     * Busca nomes e estados distintos de bacias pelo nome.
     * 
     * @param nome Nome da bacia
     * @return Lista de arrays de objetos contendo nome e estado
     */
    @Query("SELECT DISTINCT b.nome, b.estado FROM Bacia b WHERE b.nome = :nome")
    List<Object[]> findDistinctByNome(@Param("nome") String nome);

    /**
     * Busca todos os estados distintos das bacias.
     * 
     * @return Lista de estados distintos
     */
    @Query("SELECT DISTINCT b.estado FROM Bacia b")
    List<String> findDistinctEstados();

    /**
     * Busca o(s) estado(s) de uma bacia pelo nome.
     * 
     * @param nome Nome da bacia
     * @return Lista de estados associados à bacia
     */
    @Query("SELECT b.estado FROM Bacia b WHERE b.nome = :nome")
    List<String> findEstadoByNome(@Param("nome") String nome);


    /**
     * Busca uma bacia pelo nome e estado.
     * 
     * @param nome Nome da bacia
     * @param estado Estado da bacia
     * @return Optional contendo a bacia, se encontrada
     */
    Optional<Bacia> findByNomeAndEstado(String nome, String estado);


}
