package com.drillmap.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.drillmap.backend.entities.Poco;

public interface PocoRepository extends JpaRepository<Poco, Integer>, JpaSpecificationExecutor<Poco> {

     List<Poco> findByNome(String name);

     @Query("SELECT DISTINCT p.campo.bloco.bacia.estado FROM Poco p WHERE p.campo.bloco.bacia IS NOT NULL")
     List<String> findDistinctEstados();

     Optional<Poco> findByNomeAndCampoId(String nome, Integer idCampo);
}
