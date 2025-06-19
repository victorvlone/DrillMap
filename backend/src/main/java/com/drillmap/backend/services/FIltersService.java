package com.drillmap.backend.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.drillmap.backend.entities.Bacia;
import com.drillmap.backend.entities.Bloco;
import com.drillmap.backend.entities.Campo;
import com.drillmap.backend.entities.Poco;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@Service
public class FIltersService {

    @Autowired
    private EntityManager entityManager;

    private String mapearCampo(String campo) {
        return switch (campo) {
            case "conclusão" -> "conclusao";
            case "reclassificação" -> "reclassificacao";
            case "tipo de poço", "tipo de poco" -> "tipodePoco";
            case "situação" -> "situacao";
            case "poco operador" -> "pocoOperador";
            default -> campo.replaceAll("\\s+", "");
        };
    }

    public Page<String> buscarValoresUnicos(
            Map<String, Map<String, Object>> filtros,
            String campoAlvo,
            Class<?> entidadeAlvo,
            int page,
            int size) {

                System.out.println("Filtros recebidos: " + filtros);
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Object> cq = cb.createQuery(Object.class);
        Root<?> root = cq.from(entidadeAlvo);
        List<Predicate> predicates = new ArrayList<>();

        // Atualização: lógica especial para buscar estados em qualquer entidade
        if ("estado".equals(campoAlvo)) {
            Join<?, ?> joinBacia = null;
            if (entidadeAlvo.equals(Bacia.class)) {
                cq.select(root.get("estado")).distinct(true);
            } else if (entidadeAlvo.equals(Bloco.class)) {
                joinBacia = root.join("bacia");
                cq.select(joinBacia.get("estado")).distinct(true);
            } else if (entidadeAlvo.equals(Campo.class)) {
                Join<?, ?> joinBloco = root.join("bloco");
                joinBacia = joinBloco.join("bacia");
                cq.select(joinBacia.get("estado")).distinct(true);
            } else if (entidadeAlvo.equals(Poco.class)) {
                Join<?, ?> joinCampo = root.join("campo");
                Join<?, ?> joinBloco = joinCampo.join("bloco");
                joinBacia = joinBloco.join("bacia");
                cq.select(joinBacia.get("estado")).distinct(true);
            }
        } else {
            String campoAlvoMapeado = mapearCampo(campoAlvo);

            if (entidadeAlvo.equals(Campo.class)) {
                Join<?, ?> joinBloco = root.join("bloco");
                Join<?, ?> joinBacia = joinBloco.join("bacia");

                if (filtros.containsKey("bacias")) {
                    Object estado = filtros.get("bacias").get("estado");
                    if (estado != null && !estado.toString().isEmpty()) {
                        predicates.add(cb.equal(joinBacia.get("estado"), estado));
                    }
                    Object nomeBacia = filtros.get("bacias").get("nome");
                    if (nomeBacia != null && !nomeBacia.toString().isEmpty()) {
                        predicates.add(cb.equal(joinBacia.get("nome"), nomeBacia));
                    }
                }
                if (filtros.containsKey("blocos")) {
                    Object nomeBloco = filtros.get("blocos").get("nome");
                    if (nomeBloco != null && !nomeBloco.toString().isEmpty()) {
                        predicates.add(cb.equal(joinBloco.get("nome"), nomeBloco));
                    }
                }
                if (filtros.containsKey("campos")) {
                    Object nomeCampo = filtros.get("campos").get("nome");
                    if (nomeCampo != null && !nomeCampo.toString().isEmpty()) {
                        predicates.add(cb.equal(root.get("nome"), nomeCampo));
                    }
                }
                cq.select(root.get(campoAlvoMapeado)).distinct(true);
            } else if (entidadeAlvo.equals(Poco.class)) {
                Join<?, ?> joinCampo = root.join("campo");
                Join<?, ?> joinBloco = joinCampo.join("bloco");
                Join<?, ?> joinBacia = joinBloco.join("bacia");

                if (filtros.containsKey("bacias")) {
                    Object estado = filtros.get("bacias").get("estado");
                    if (estado != null && !estado.toString().isEmpty()) {
                        predicates.add(cb.equal(joinBacia.get("estado"), estado));
                    }
                    Object nomeBacia = filtros.get("bacias").get("nome");
                    if (nomeBacia != null && !nomeBacia.toString().isEmpty()) {
                        predicates.add(cb.equal(joinBacia.get("nome"), nomeBacia));
                    }
                }
                if (filtros.containsKey("blocos")) {
                    Object nomeBloco = filtros.get("blocos").get("nome");
                    if (nomeBloco != null && !nomeBloco.toString().isEmpty()) {
                        predicates.add(cb.equal(joinBloco.get("nome"), nomeBloco));
                    }
                }
                if (filtros.containsKey("campos")) {
                    Object nomeCampo = filtros.get("campos").get("nome");
                    if (nomeCampo != null && !nomeCampo.toString().isEmpty()) {
                        predicates.add(cb.equal(joinCampo.get("nome"), nomeCampo));
                    }
                }
                if (filtros.containsKey("poços")) {
                    Map<String, Object> camposPoco = filtros.get("poços");
                    for (Map.Entry<String, Object> entry : camposPoco.entrySet()) {
                        String nomeCampo = mapearCampo(entry.getKey());
                        Object valor = entry.getValue();
                        if (valor != null && !valor.toString().isEmpty()) {
                            predicates.add(cb.equal(root.get(nomeCampo), valor));
                        }
                    }
                }
                cq.select(root.get(campoAlvoMapeado)).distinct(true);
            } else if (entidadeAlvo.equals(Bloco.class)) {
                Join<?, ?> joinBacia = root.join("bacia");

                if (filtros.containsKey("bacias")) {
                    Object estado = filtros.get("bacias").get("estado");
                    if (estado != null && !estado.toString().isEmpty()) {
                        predicates.add(cb.equal(joinBacia.get("estado"), estado));
                    }
                    Object nomeBacia = filtros.get("bacias").get("nome");
                    if (nomeBacia != null && !nomeBacia.toString().isEmpty()) {
                        predicates.add(cb.equal(joinBacia.get("nome"), nomeBacia));
                    }
                }
                if (filtros.containsKey("blocos")) {
                    Object nomeBloco = filtros.get("blocos").get("nome");
                    if (nomeBloco != null && !nomeBloco.toString().isEmpty()) {
                        predicates.add(cb.equal(root.get("nome"), nomeBloco));
                    }
                }
                cq.select(root.get(campoAlvoMapeado)).distinct(true);
            } else if (entidadeAlvo.equals(Bacia.class)) {
                if (filtros.containsKey("bacias")) {
                    Object nomeBacia = filtros.get("bacias").get("nome");
                    if (nomeBacia != null && !nomeBacia.toString().isEmpty()) {
                        predicates.add(cb.equal(root.get("nome"), nomeBacia));
                    }
                    Object estado = filtros.get("bacias").get("estado");
                    if (estado != null && !estado.toString().isEmpty()) {
                        predicates.add(cb.equal(root.get("estado"), estado));
                    }
                }
                cq.select(root.get(campoAlvoMapeado)).distinct(true);
            }
        }

        if (!predicates.isEmpty()) {
            cq.where(cb.and(predicates.toArray(new Predicate[0])));
        }

        TypedQuery<?> query = entityManager.createQuery(cq);
        query.setFirstResult(page * size);
        query.setMaxResults(size);

        // Conta total de valores únicos
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<?> countRoot = countQuery.from(entidadeAlvo);
        List<Predicate> countPredicates = new ArrayList<>();

        // Atualização: lógica especial para contar estados em qualquer entidade
        if ("estado".equals(campoAlvo)) {
            Join<?, ?> countJoinBacia = null;
            if (entidadeAlvo.equals(Bacia.class)) {
                countQuery.select(cb.countDistinct(countRoot.get("estado")));
            } else if (entidadeAlvo.equals(Bloco.class)) {
                countJoinBacia = countRoot.join("bacia");
                countQuery.select(cb.countDistinct(countJoinBacia.get("estado")));
            } else if (entidadeAlvo.equals(Campo.class)) {
                Join<?, ?> countJoinBloco = countRoot.join("bloco");
                countJoinBacia = countJoinBloco.join("bacia");
                countQuery.select(cb.countDistinct(countJoinBacia.get("estado")));
            } else if (entidadeAlvo.equals(Poco.class)) {
                Join<?, ?> countJoinCampo = countRoot.join("campo");
                Join<?, ?> countJoinBloco = countJoinCampo.join("bloco");
                countJoinBacia = countJoinBloco.join("bacia");
                countQuery.select(cb.countDistinct(countJoinBacia.get("estado")));
            }
        } else {
            String campoAlvoMapeado = mapearCampo(campoAlvo);

            if (entidadeAlvo.equals(Campo.class)) {
                Join<?, ?> countJoinBloco = countRoot.join("bloco");
                Join<?, ?> countJoinBacia = countJoinBloco.join("bacia");

                if (filtros.containsKey("bacias")) {
                    Object estado = filtros.get("bacias").get("estado");
                    if (estado != null && !estado.toString().isEmpty()) {
                        countPredicates.add(cb.equal(countJoinBacia.get("estado"), estado));
                    }
                    Object nomeBacia = filtros.get("bacias").get("nome");
                    if (nomeBacia != null && !nomeBacia.toString().isEmpty()) {
                        countPredicates.add(cb.equal(countJoinBacia.get("nome"), nomeBacia));
                    }
                }
                if (filtros.containsKey("blocos")) {
                    Object nomeBloco = filtros.get("blocos").get("nome");
                    if (nomeBloco != null && !nomeBloco.toString().isEmpty()) {
                        countPredicates.add(cb.equal(countJoinBloco.get("nome"), nomeBloco));
                    }
                }
                if (filtros.containsKey("campos")) {
                    Object nomeCampo = filtros.get("campos").get("nome");
                    if (nomeCampo != null && !nomeCampo.toString().isEmpty()) {
                        countPredicates.add(cb.equal(countRoot.get("nome"), nomeCampo));
                    }
                }
                countQuery.select(cb.countDistinct(countRoot.get(campoAlvoMapeado)));
            } else if (entidadeAlvo.equals(Poco.class)) {
                Join<?, ?> countJoinCampo = countRoot.join("campo");
                Join<?, ?> countJoinBloco = countJoinCampo.join("bloco");
                Join<?, ?> countJoinBacia = countJoinBloco.join("bacia");

                if (filtros.containsKey("bacias")) {
                    Object estado = filtros.get("bacias").get("estado");
                    if (estado != null && !estado.toString().isEmpty()) {
                        countPredicates.add(cb.equal(countJoinBacia.get("estado"), estado));
                    }
                    Object nomeBacia = filtros.get("bacias").get("nome");
                    if (nomeBacia != null && !nomeBacia.toString().isEmpty()) {
                        countPredicates.add(cb.equal(countJoinBacia.get("nome"), nomeBacia));
                    }
                }
                if (filtros.containsKey("blocos")) {
                    Object nomeBloco = filtros.get("blocos").get("nome");
                    if (nomeBloco != null && !nomeBloco.toString().isEmpty()) {
                        countPredicates.add(cb.equal(countJoinBloco.get("nome"), nomeBloco));
                    }
                }
                if (filtros.containsKey("campos")) {
                    Object nomeCampo = filtros.get("campos").get("nome");
                    if (nomeCampo != null && !nomeCampo.toString().isEmpty()) {
                        countPredicates.add(cb.equal(countJoinCampo.get("nome"), nomeCampo));
                    }
                }
                if (filtros.containsKey("poços")) {
                    Map<String, Object> camposPoco = filtros.get("poços");
                    for (Map.Entry<String, Object> entry : camposPoco.entrySet()) {
                        String nomeCampo = mapearCampo(entry.getKey());
                        Object valor = entry.getValue();
                        if (valor != null && !valor.toString().isEmpty()) {
                            countPredicates.add(cb.equal(countRoot.get(nomeCampo), valor));
                        }
                    }
                }
                countQuery.select(cb.countDistinct(countRoot.get(campoAlvoMapeado)));
            } else if (entidadeAlvo.equals(Bloco.class)) {
                Join<?, ?> countJoinBacia = countRoot.join("bacia");

                if (filtros.containsKey("bacias")) {
                    Object estado = filtros.get("bacias").get("estado");
                    if (estado != null && !estado.toString().isEmpty()) {
                        countPredicates.add(cb.equal(countJoinBacia.get("estado"), estado));
                    }
                    Object nomeBacia = filtros.get("bacias").get("nome");
                    if (nomeBacia != null && !nomeBacia.toString().isEmpty()) {
                        countPredicates.add(cb.equal(countJoinBacia.get("nome"), nomeBacia));
                    }
                }
                if (filtros.containsKey("blocos")) {
                    Object nomeBloco = filtros.get("blocos").get("nome");
                    if (nomeBloco != null && !nomeBloco.toString().isEmpty()) {
                        countPredicates.add(cb.equal(countRoot.get("nome"), nomeBloco));
                    }
                }
                countQuery.select(cb.countDistinct(countRoot.get(campoAlvoMapeado)));
            } else if (entidadeAlvo.equals(Bacia.class)) {
                if (filtros.containsKey("bacias")) {
                    Object nomeBacia = filtros.get("bacias").get("nome");
                    if (nomeBacia != null && !nomeBacia.toString().isEmpty()) {
                        countPredicates.add(cb.equal(countRoot.get("nome"), nomeBacia));
                    }
                    Object estado = filtros.get("bacias").get("estado");
                    if (estado != null && !estado.toString().isEmpty()) {
                        countPredicates.add(cb.equal(countRoot.get("estado"), estado));
                    }
                }
                countQuery.select(cb.countDistinct(countRoot.get(campoAlvoMapeado)));
            }
        }

        if (!countPredicates.isEmpty()) {
            countQuery.where(cb.and(countPredicates.toArray(new Predicate[0])));
        }
        Long total = entityManager.createQuery(countQuery).getSingleResult();

        List<?> resultadosBrutos = query.getResultList();
        List<String> resultados = resultadosBrutos.stream()
            .map(obj -> obj != null ? obj.toString() : null)
            .toList();
        return new PageImpl<>(resultados, PageRequest.of(page, size), total);
    }
}