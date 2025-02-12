package com.drillmap.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.drillmap.backend.services.SearchService;

import lombok.AllArgsConstructor;

@CrossOrigin("*")
@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/filtros")
    public ResponseEntity<List<Map<String, Object>>> subfiltrarDados(@RequestParam String tabela,
     @RequestParam String campo,
     @RequestParam(defaultValue = "0") int page,
     @RequestParam(defaultValue = "50") int size){

            List<Map<String, Object>> result = searchService.subFiltros(tabela, campo, page, size);

            return ResponseEntity.ok(result);
    }

    @GetMapping("/search")
    public ResponseEntity <List<Map<String, Object>>> filtrarDados(@RequestParam String nome, @RequestParam String categoria){

        List<Map<String, Object>> result = searchService.filtrarDados(nome, categoria);
        return ResponseEntity.ok(result);
    }

}
