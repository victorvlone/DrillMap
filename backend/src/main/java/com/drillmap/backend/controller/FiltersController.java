package com.drillmap.backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.drillmap.backend.entities.Bacia;
import com.drillmap.backend.entities.Bloco;
import com.drillmap.backend.entities.Campo;
import com.drillmap.backend.entities.Poco;
import com.drillmap.backend.services.FIltersService;

import lombok.AllArgsConstructor;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/filters")
@AllArgsConstructor
public class FiltersController {

    @Autowired
    private final FIltersService filtersService;

    @PostMapping("/valores-unicos")
    public Page<String> getValoresUnicos(
            @RequestParam String campoAlvo,
            @RequestParam String entidadeAlvo,
            @RequestParam int page,
            @RequestParam int size,
            @RequestBody Map<String, Map<String, Object>> filtros) {
        Class<?> entidadeClass = switch (entidadeAlvo) {
            case "bacias" -> Bacia.class;
            case "blocos" -> Bloco.class;
            case "campos" -> Campo.class;
            case "poços" -> Poco.class;
            default -> throw new IllegalArgumentException("Entidade inválida");
        };
        return filtersService.buscarValoresUnicos(filtros, campoAlvo, entidadeClass, page, size);
    }

}
