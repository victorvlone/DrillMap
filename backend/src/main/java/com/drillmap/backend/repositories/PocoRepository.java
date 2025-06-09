package com.drillmap.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.drillmap.backend.entities.Poco;

/**
 * Repositório para a entidade Poco.
 * Fornece métodos para operações de CRUD, consultas customizadas e suporte a Specifications.
 */
public interface PocoRepository extends JpaRepository<Poco, Integer>, JpaSpecificationExecutor<Poco> {

     /**
      * Busca todos os poços pelo nome.
      * 
      * @param name Nome do poço
      * @return Lista de poços com o nome informado
      */
     List<Poco> findByNome(String name);

     /**
      * Busca todos os estados distintos associados aos poços.
      * 
      * @return Lista de estados distintos
      */
     @Query("SELECT DISTINCT p.campo.bloco.bacia.estado FROM Poco p WHERE p.campo.bloco.bacia IS NOT NULL")
     List<String> findDistinctEstados();

     /**
      * Busca um poço pelo nome e pelo id do campo.
      * 
      * @param nome Nome do poço
      * @param idCampo ID do campo
      * @return Optional contendo o poço, se encontrado
      */
     Optional<Poco> findByNomeAndCampoId(String nome, Integer idCampo);
}
