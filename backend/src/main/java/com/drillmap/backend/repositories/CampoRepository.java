package com.drillmap.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.drillmap.backend.entities.Bloco;
import com.drillmap.backend.entities.Campo;

public interface CampoRepository extends JpaRepository<Campo, Integer> {

     List<Campo> findByNome(String name);

     @Query("SELECT DISTINCT c.bloco.bacia.estado FROM Campo c WHERE c.bloco.bacia IS NOT NULL")
    List<String> findDistinctEstados();

    @Query("SELECT c.bloco.bacia.estado FROM Campo c JOIN c.bloco b JOIN b.bacia bacia WHERE c.nome = :nome")
    List<String> findEstadoByNome(@Param("nome") String nome);

    Optional<Campo> findByNomeAndBloco(String nome, Bloco bloco);

}
