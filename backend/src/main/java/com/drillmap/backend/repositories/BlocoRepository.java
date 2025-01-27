package com.drillmap.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.drillmap.backend.entities.Bloco;

public interface BlocoRepository extends JpaRepository<Bloco, Integer> {

    List<Bloco> findByNome(String nome);
}
