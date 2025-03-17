package com.drillmap.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.drillmap.backend.entities.Bacia;
import com.drillmap.backend.entities.Bloco;

public interface BlocoRepository extends JpaRepository<Bloco, Integer> {

    List<Bloco> findByNome(String nome);

    @Query("SELECT DISTINCT b.bacia.estado FROM Bloco b WHERE b.bacia IS NOT NULL")
    List<String> findDistinctEstados();

    @Query("SELECT bl.bacia.estado FROM Bloco bl WHERE LOWER(bl.nome) LIKE LOWER(CONCAT('%', :nome, '%'))")
    List<String> findEstadoByNome(@Param("nome") String nome);


    Optional<Bloco> findByNomeAndBacia(String nome, Bacia bacia);

}
