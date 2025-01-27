package com.drillmap.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.drillmap.backend.entities.Campo;

public interface CampoRepository extends JpaRepository<Campo, Integer> {

     List<Campo> findByNome(String name);
}
