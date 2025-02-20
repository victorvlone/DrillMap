package com.drillmap.backend.config;

import org.springframework.data.jpa.domain.Specification;

import com.drillmap.backend.entities.Poco;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;

public class PocoSpecification {

    public static Specification<Poco> filtrarPor(String filtro, String valor){
        return (Root<Poco> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            return criteriaBuilder.equal(root.get(filtro), valor);
        };
    }
}
