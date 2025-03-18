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
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;

public class PocoSpecification {

     public static Specification<Poco> criarSpecification(String categoria, Map<String, Object> filtros) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            Join<Poco, Campo> campoJoin = null;
            Join<Campo, Bloco> blocoJoin = null;
            Join<Bloco, Bacia> baciaJoin = null;

            if (filtros != null && !filtros.isEmpty()) {
                for (Map.Entry<String, Object> filtro : filtros.entrySet()) {
                    String nomeFiltro = filtro.getKey();
                    Object valor = filtro.getValue();

                    if (valor == null) continue;

                    switch (categoria.toLowerCase()) {
                        case "poços":
                            predicates.add(criarPredicado(cb, root, nomeFiltro, valor));
                            break;
                        case "campos":
                            if (campoJoin == null) campoJoin = root.join("campo");
                            predicates.add(criarPredicado(cb, campoJoin, nomeFiltro, valor));
                            break;
                        case "blocos":
                            if (campoJoin == null) campoJoin = root.join("campo");
                            if (blocoJoin == null) blocoJoin = campoJoin.join("bloco");
                            predicates.add(criarPredicado(cb, blocoJoin, nomeFiltro, valor));
                            break;
                        case "bacias":
                            if (campoJoin == null) campoJoin = root.join("campo");
                            if (blocoJoin == null) blocoJoin = campoJoin.join("bloco");
                            if (baciaJoin == null) baciaJoin = blocoJoin.join("bacia");
                            predicates.add(criarPredicado(cb, baciaJoin, nomeFiltro, valor));
                            break;
                    }
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static Predicate criarPredicado(CriteriaBuilder cb, Path<?> path, String nomeFiltro, Object valor) {
        if (valor instanceof String) {
            return cb.like(cb.lower(path.get(nomeFiltro)), "%" + valor.toString().toLowerCase() + "%");
        } else {
            return cb.equal(path.get(nomeFiltro), valor);
        }
    }

}
