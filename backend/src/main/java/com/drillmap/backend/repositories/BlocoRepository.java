package com.drillmap.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.drillmap.backend.entities.Bacia;
import com.drillmap.backend.entities.Bloco;

/**
 * Repositório para a entidade Bloco.
 * Fornece métodos para operações de CRUD, consultas customizadas e suporte a Specifications.
 */
public interface BlocoRepository extends JpaRepository<Bloco, Integer>,  JpaSpecificationExecutor<Bloco> {

    /**
     * Busca todos os blocos pelo nome.
     * 
     * @param nome Nome do bloco
     * @return Lista de blocos com o nome informado
     */
    List<Bloco> findByNome(String nome);

    /**
     * Busca todos os estados distintos associados aos blocos.
     * 
     * @return Lista de estados distintos
     */
    @Query("SELECT DISTINCT b.bacia.estado FROM Bloco b WHERE b.bacia IS NOT NULL")
    List<String> findDistinctEstados();

    /**
     * Busca o(s) estado(s) de um bloco pelo nome.
     * 
     * @param nome Nome do bloco
     * @return Lista de estados associados ao bloco
     */
    @Query("SELECT b.bacia.estado FROM Bloco b JOIN b.bacia bacia WHERE b.nome = :nome")
    List<String> findEstadoByNome(@Param("nome") String nome);

    /**
     * Busca um bloco pelo nome e pela bacia.
     * 
     * @param nome Nome do bloco
     * @param bacia Bacia associada
     * @return Optional contendo o bloco, se encontrado
     */
    Optional<Bloco> findByNomeAndBacia(String nome, Bacia bacia);

}
