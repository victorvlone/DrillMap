package com.drillmap.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.drillmap.backend.entities.Bacia;

public interface BaciaRepository extends JpaRepository<Bacia, Integer> {

    @Query("SELECT DISTINCT b.nome, b.estado FROM Bacia b WHERE b.nome = :nome")
    List<Object[]> findDistinctByNome(@Param("nome") String nome);

    @Query("SELECT DISTINCT b.estado FROM Bacia b")
    List<String> findDistinctEstados();

    @Query("SELECT b.estado FROM Bacia b WHERE b.nome = :nome")
    List<String> findEstadoByNome(@Param("nome") String nome);


    Optional<Bacia> findByNomeAndEstado(String nome, String estado);


}
