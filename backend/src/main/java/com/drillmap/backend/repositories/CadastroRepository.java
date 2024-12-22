package com.drillmap.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.drillmap.backend.entities.Cadastro;

public interface CadastroRepository extends JpaRepository<Cadastro, Integer> {

}
