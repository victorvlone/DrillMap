package com.drillmap.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.drillmap.backend.entities.Bacia;
import com.drillmap.backend.entities.Bloco;

public interface BlocoRepository extends JpaRepository<Bloco, Integer> {

    List<Bloco> findByNome(String nome);

    @Query("SELECT DISTINCT b.bacia.estado FROM Bloco b WHERE b.bacia IS NOT NULL")
    List<String> findDistinctEstados();

    Optional<Bloco> findByNomeAndBacia(String nome, Bacia bacia);

}
