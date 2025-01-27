package com.drillmap.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.drillmap.backend.entities.Poco;

public interface PocoRepository extends JpaRepository<Poco, Integer> {

     List<Poco> findByNome(String name);
}
