package com.drillmap.backend.specifications;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.domain.Specification;

import com.drillmap.backend.entities.Campo;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class CampoSpecification implements Specification<Campo> {

    private final Map<String, Object> filtros;

    public CampoSpecification(Map<String, Object> filtros){
        this.filtros = filtros;
    }

    @Override
    public Predicate toPredicate(Root<Campo> root, CriteriaQuery<?> query, CriteriaBuilder builder){

        List<Predicate> predicates = new ArrayList<>();
        filtros.forEach((chave, valor) -> {
            if (valor != null){
                predicates.add(builder.equal(root.get(chave), valor));
            }
        });

        return builder.and(predicates.toArray(new Predicate[0]));
    }
}
