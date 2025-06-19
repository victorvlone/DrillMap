package com.drillmap.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.drillmap.backend.dtos.PocoDTO;
import com.drillmap.backend.services.SearchService;

import lombok.AllArgsConstructor;

/**
 * Controller responsável por expor endpoints de busca e filtragem de poços e
 * entidades relacionadas.
 */
@CrossOrigin("*")
@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class SearchController {

    // Injeta o serviço de busca para acessar as regras de negócio
    private final SearchService searchService;

    /**
     * Endpoint para buscar valores distintos de um campo em uma tabela, com suporte
     * a paginação.
     * 
     * @param tabela Nome da tabela a ser consultada
     * @param campo  Nome do campo a ser filtrado
     * @param page   Página solicitada (padrão 0)
     * @param size   Tamanho da página (padrão 50)
     * @return Lista de mapas com os valores encontrados
     */
    @GetMapping("/filtros")
    public ResponseEntity<List<Map<String, Object>>> subfiltrarDados(@RequestParam String tabela,
            @RequestParam String campo) {

        List<Map<String, Object>> result = searchService.subFiltros(tabela, campo);

        return ResponseEntity.ok(result);
    }

    /**
     * Endpoint para buscar poços aplicando filtros dinâmicos e paginação.
     * 
     * @param filtros Mapa de filtros por categoria (ex: Bacias, Blocos, etc)
     * @param page    Página solicitada (padrão 0)
     * @param size    Tamanho da página (padrão 100)
     * @return Página de PocoDTOs filtrados
     */
    @PostMapping("/search")
    public ResponseEntity<?> search(@RequestBody Map<String, Map<String, Object>> filtros,
            @RequestParam(defaultValue = "0") int page, // Página inicial padrão = 0
            @RequestParam(defaultValue = "100") int size) {
        // Exibe no console os filtros recebidos (para debug)
        System.out.println("Recebido: " + filtros); // Só para debugar e ver se chegou certinho

        // Realiza a busca paginada de poços com os filtros informados
        Page<PocoDTO> resultados = searchService.buscarPoços(filtros, page, size);

        // Retorna os resultados da consulta
        return ResponseEntity.ok(resultados);
    }

}
