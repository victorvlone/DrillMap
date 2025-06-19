package com.drillmap.backend.specifications;

import org.springframework.data.jpa.domain.Specification;

import com.drillmap.backend.entities.Bacia;
import com.drillmap.backend.entities.Bloco;
import com.drillmap.backend.entities.Campo;
import com.drillmap.backend.entities.Poco;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import java.util.Map;

public class FiltersSpecification {
    public static <T> Specification<T> build(Map<String, Map<String, Object>> filtros, Class<T> entidadeAlvo) {
        return (root, query, cb) -> {
            Predicate predicate = cb.conjunction();

            if (entidadeAlvo.equals(Campo.class)) {
                Join<?, ?> joinBloco = null;
                Join<?, ?> joinBacia = null;
                if (filtros.containsKey("bloco") || filtros.containsKey("bacia")) {
                    joinBloco = root.join("bloco");
                }
                if (filtros.containsKey("bacia")) {
                    joinBacia = joinBloco.join("bacia");
                }
                if (filtros.containsKey("bacia")) {
                    Object nomeBacia = filtros.get("bacia").get("nome");
                    if (nomeBacia != null && !nomeBacia.toString().isEmpty()) {
                        predicate = cb.and(predicate, cb.equal(joinBacia.get("nome"), nomeBacia));
                    }
                }
                if (filtros.containsKey("bloco")) {
                    Object nomeBloco = filtros.get("bloco").get("nome");
                    if (nomeBloco != null && !nomeBloco.toString().isEmpty()) {
                        predicate = cb.and(predicate, cb.equal(joinBloco.get("nome"), nomeBloco));
                    }
                }
                if (filtros.containsKey("campo")) {
                    Object nomeCampo = filtros.get("campo").get("nome");
                    if (nomeCampo != null && !nomeCampo.toString().isEmpty()) {
                        predicate = cb.and(predicate, cb.equal(root.get("nome"), nomeCampo));
                    }
                }
            } else if (entidadeAlvo.equals(Poco.class)) {
                Join<?, ?> joinCampo = root.join("campo");
                Join<?, ?> joinBloco = joinCampo.join("bloco");
                Join<?, ?> joinBacia = joinBloco.join("bacia");

                if (filtros.containsKey("bacia")) {
                    Object nomeBacia = filtros.get("bacia").get("nome");
                    if (nomeBacia != null && !nomeBacia.toString().isEmpty()) {
                        predicate = cb.and(predicate, cb.equal(joinBacia.get("nome"), nomeBacia));
                    }
                }
                if (filtros.containsKey("bloco")) {
                    Object nomeBloco = filtros.get("bloco").get("nome");
                    if (nomeBloco != null && !nomeBloco.toString().isEmpty()) {
                        predicate = cb.and(predicate, cb.equal(joinBloco.get("nome"), nomeBloco));
                    }
                }
                if (filtros.containsKey("campo")) {
                    Object nomeCampo = filtros.get("campo").get("nome");
                    if (nomeCampo != null && !nomeCampo.toString().isEmpty()) {
                        predicate = cb.and(predicate, cb.equal(joinCampo.get("nome"), nomeCampo));
                    }
                }
                if (filtros.containsKey("poco")) {
                    Object nomePoco = filtros.get("poco").get("nome");
                    if (nomePoco != null && !nomePoco.toString().isEmpty()) {
                        predicate = cb.and(predicate, cb.equal(root.get("nome"), nomePoco));
                    }
                }
            } else if (entidadeAlvo.equals(Bloco.class)) {
                Join<?, ?> joinBacia = root.join("bacia");
                if (filtros.containsKey("bacia")) {
                    Object nomeBacia = filtros.get("bacia").get("nome");
                    if (nomeBacia != null && !nomeBacia.toString().isEmpty()) {
                        predicate = cb.and(predicate, cb.equal(joinBacia.get("nome"), nomeBacia));
                    }
                }
                if (filtros.containsKey("bloco")) {
                    Object nomeBloco = filtros.get("bloco").get("nome");
                    if (nomeBloco != null && !nomeBloco.toString().isEmpty()) {
                        predicate = cb.and(predicate, cb.equal(root.get("nome"), nomeBloco));
                    }
                }
            } else if (entidadeAlvo.equals(Bacia.class)) {
                // Filtro por bacia (nome)
                if (filtros.containsKey("bacia")) {
                    Object nomeBacia = filtros.get("bacia").get("nome");
                    if (nomeBacia != null && !nomeBacia.toString().isEmpty()) {
                        predicate = cb.and(predicate, cb.equal(root.get("nome"), nomeBacia));
                    }
                    Object estado = filtros.get("bacia").get("estado");
                    if (estado != null && !estado.toString().isEmpty()) {
                        predicate = cb.and(predicate, cb.equal(root.get("estado"), estado));
                    }
                }
                // Filtro por bloco relacionado (join em coleção)
                if (filtros.containsKey("bloco")) {
                    Join<?, ?> joinBloco = root.join("blocos"); // nome do atributo na entidade Bacia
                    Object nomeBloco = filtros.get("bloco").get("nome");
                    if (nomeBloco != null && !nomeBloco.toString().isEmpty()) {
                        predicate = cb.and(predicate, cb.equal(joinBloco.get("nome"), nomeBloco));
                    }
                }
            }
            return predicate;
        };
    }
}
