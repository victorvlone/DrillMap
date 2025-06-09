package com.drillmap.backend.specifications;

// Importações necessárias para listas, mapas e especificações do Spring Data JPA
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

/**
 * Classe utilitária para criar especificações dinâmicas de filtragem para a entidade Poco.
 */
public class PocoSpecification {
    /**
     * Método estático que retorna uma Specification de Poco baseada em filtros dinâmicos.
     * 
     * @param filtros Mapa de filtros, onde a chave é a categoria (ex: "Bacias", "Blocos", etc)
     *                e o valor é um mapa de nome do filtro para valor do filtro.
     * @return Specification<Poco> para ser usada em consultas JPA.
     */
    public static Specification<Poco> aplicarFiltros(Map<String, Map<String, Object>> filtros) {
        // Retorna uma Specification anônima
        return (Root<Poco> root, jakarta.persistence.criteria.CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            // Lista de predicados (condições) que serão aplicadas na consulta
            List<Predicate> predicates = new ArrayList<>();
    
            // Itera sobre cada categoria de filtro (ex: "Bacias", "Blocos", etc)
            for (Map.Entry<String, Map<String, Object>> categoriaEntry : filtros.entrySet()) {
                    String categoria = categoriaEntry.getKey(); // Nome da categoria
                    Map<String, Object> filtrosCategoria = categoriaEntry.getValue(); // Filtros da categoria
    
                    // Itera sobre cada filtro dentro da categoria
                    for (Map.Entry<String, Object> filtro : filtrosCategoria.entrySet()) {
                        String nomeFiltro = filtro.getKey(); // Nome do campo a ser filtrado
                        Object valorFiltro = filtro.getValue(); // Valor do filtro

                        // Se a categoria for "Bacias", faz join até Bacia e aplica o filtro
                        if ("Bacias".equals(categoria)) {
                            Join<Poco, Campo> campoJoin = root.join("campo");
                            Join<Campo, Bloco> blocoJoin = campoJoin.join("bloco");
                            Join<Bloco, Bacia> baciaJoin = blocoJoin.join("bacia");
                            predicates.add(criteriaBuilder.equal(baciaJoin.get(nomeFiltro), valorFiltro));
                        // Se a categoria for "Blocos", faz join até Bloco e aplica o filtro
                        } else if ("Blocos".equals(categoria)) {
                            Join<Poco, Campo> campoJoin = root.join("campo");
                            Join<Campo, Bloco> blocoJoin = campoJoin.join("bloco");
                            predicates.add(criteriaBuilder.equal(blocoJoin.get(nomeFiltro), valorFiltro));
                        // Se a categoria for "Campos", faz join até Campo e aplica o filtro
                        } else if ("Campos".equals(categoria)) {
                            Join<Poco, Campo> campoJoin = root.join("campo");
                            predicates.add(criteriaBuilder.equal(campoJoin.get(nomeFiltro), valorFiltro));
                        // Se a categoria for "Poços", aplica o filtro diretamente no root
                        } else if ("Poços".equals(categoria)) {
                            predicates.add(criteriaBuilder.equal(root.get(nomeFiltro), valorFiltro));
                        }
                    }
                }
            // Retorna todos os predicados combinados com AND
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    };
}

