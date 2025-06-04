package com.drillmap.backend.specifications;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.domain.Specification;

import com.drillmap.backend.entities.Bacia;
import com.drillmap.backend.entities.Bloco;
import com.drillmap.backend.entities.Campo;
import com.drillmap.backend.entities.Poco;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class PocoSpecification {
    public static Specification<Poco> aplicarFiltros(Map<String, Map<String, Object>> filtros) {
        return (Root<Poco> root, jakarta.persistence.criteria.CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
    
            // Iterar sobre o map de filtros
            for (Map.Entry<String, Map<String, Object>> categoriaEntry : filtros.entrySet()) {
                    String categoria = categoriaEntry.getKey();
                    Map<String, Object> filtrosCategoria = categoriaEntry.getValue();  // Filtros específicos dessa categoria
    
                    // Aplicar os filtros dessa categoria
                    for (Map.Entry<String, Object> filtro : filtrosCategoria.entrySet()) {
                        String nomeFiltro = filtro.getKey();  // Nome do filtro, ex: "situacao", "nome"
                        Object valorFiltro = filtro.getValue();  // Valor do filtro, ex: "ABANDONADO PERMANENTEMENTE", "Potiguar"
    
                        // Aplicar filtro dependendo da categoria
                        if ("Bacias".equals(categoria)) {
                            Join<Poco, Campo> campoJoin = root.join("campo");
                            Join<Campo, Bloco> blocoJoin = campoJoin.join("bloco");
                            Join<Bloco, Bacia> baciaJoin = blocoJoin.join("bacia");
                            predicates.add(criteriaBuilder.equal(baciaJoin.get(nomeFiltro), valorFiltro));
                        } else if ("Blocos".equals(categoria)) {
                            Join<Poco, Campo> campoJoin = root.join("campo");
                            Join<Campo, Bloco> blocoJoin = campoJoin.join("bloco");
                            predicates.add(criteriaBuilder.equal(blocoJoin.get(nomeFiltro), valorFiltro));
                        } else if ("Campos".equals(categoria)) {
                            Join<Poco, Campo> campoJoin = root.join("campo");
                            predicates.add(criteriaBuilder.equal(campoJoin.get(nomeFiltro), valorFiltro));
                        } else if ("Poços".equals(categoria)) {
                            predicates.add(criteriaBuilder.equal(root.get(nomeFiltro), valorFiltro));
                        }
                    }
                }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    };
}

