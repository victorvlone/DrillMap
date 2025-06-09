package com.drillmap.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.drillmap.backend.entities.Bloco;
import com.drillmap.backend.entities.Campo;

/**
 * Repositório para a entidade Campo.
 * Fornece métodos para operações de CRUD, consultas customizadas e suporte a Specifications.
 */
public interface CampoRepository extends JpaRepository<Campo, Integer>,  JpaSpecificationExecutor<Campo> {

    /**
     * Busca todos os campos pelo nome.
     * 
     * @param name Nome do campo
     * @return Lista de campos com o nome informado
     */
    List<Campo> findByNome(String name);

    /**
     * Busca todos os estados distintos associados aos campos.
     * 
     * @return Lista de estados distintos
     */
    @Query("SELECT DISTINCT c.bloco.bacia.estado FROM Campo c WHERE c.bloco.bacia IS NOT NULL")
    List<String> findDistinctEstados();

    /**
     * Busca o(s) estado(s) de um campo pelo nome.
     * 
     * @param nome Nome do campo
     * @return Lista de estados associados ao campo
     */
    @Query("SELECT c.bloco.bacia.estado FROM Campo c JOIN c.bloco b JOIN b.bacia bacia WHERE c.nome = :nome")
    List<String> findEstadoByNome(@Param("nome") String nome);

    /**
     * Busca um campo pelo nome e pelo bloco.
     * 
     * @param nome Nome do campo
     * @param bloco Bloco associado
     * @return Optional contendo o campo, se encontrado
     */
    Optional<Campo> findByNomeAndBloco(String nome, Bloco bloco);

}
