package com.drillmap.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.drillmap.backend.entities.Bacia;

public interface BaciaRepository extends JpaRepository<Bacia, Integer> {

    List<Bacia> findByNome(String name);

    @Query("SELECT DISTINCT b.nome, b.estado FROM Bacia b WHERE b.nome = :nome")
    List<Object[]> findDistinctByNome(@Param("nome") String nome);

}
