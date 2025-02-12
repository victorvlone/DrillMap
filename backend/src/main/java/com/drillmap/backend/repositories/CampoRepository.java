package com.drillmap.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.drillmap.backend.entities.Campo;

public interface CampoRepository extends JpaRepository<Campo, Integer> {

     List<Campo> findByNome(String name);

     @Query("SELECT DISTINCT c.bloco.bacia.estado FROM Campo c WHERE c.bloco.bacia IS NOT NULL")
    List<String> findDistinctEstados();
}
