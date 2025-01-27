package com.drillmap.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.drillmap.backend.entities.Bloco;
import com.drillmap.backend.entities.Campo;
import com.drillmap.backend.entities.Poco;
import com.drillmap.backend.repositories.BaciaRepository;
import com.drillmap.backend.repositories.BlocoRepository;
import com.drillmap.backend.repositories.CampoRepository;
import com.drillmap.backend.repositories.PocoRepository;

@CrossOrigin("*")
@RestController
@RequestMapping("/api")
public class SearchController {

    @Autowired
    private BaciaRepository baciaRepository;

    @Autowired
    private BlocoRepository blocoRepository;

    @Autowired
    private CampoRepository campoRepository;

    @Autowired
    private PocoRepository pocoRepository;

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam String nome, @RequestParam String categoria){

        System.out.println("Recebendo busca: nome=" + nome + ", categoria=" + categoria);
        if(nome == null || nome.trim().isEmpty()){
            return ResponseEntity.badRequest().body("O parametro 'nome' é obrigatório");
        }

        if(categoria == null || categoria.trim().isEmpty()){
            return ResponseEntity.badRequest().body("O parametro 'categoria' é obrigatório");
        }
        switch (categoria.toLowerCase()){
            case "bacias":
                return ResponseEntity.ok(searchBacias(nome));

            case "blocos":
                return ResponseEntity.ok(searchBlocos(nome));

            case "campos":
                return ResponseEntity.ok(searchCampos(nome));

            case "pocos":
                return ResponseEntity.ok(searchPocos(nome));

            default:
                return ResponseEntity.badRequest().body("Categoria inválida");
        }
    }

    private List<Map<String, String>> searchBacias(String nome){
        List<Object[]> resultados = baciaRepository.findDistinctByNome(nome);

        return resultados.stream()
                .map(obj -> {
                    Map<String, String> response = new HashMap<>();
                    response.put("nome", (String) obj[0]);
                    response.put("estado", (String) obj[1]);
                    return response;
                })
                .collect(Collectors.toList());
    }
    private List<Map<String, Object>> searchBlocos(String nome){
        List<Bloco> blocos = blocoRepository.findByNome(nome);

        return blocos.stream()
                .map(bloco -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("bloco", bloco);
                    if(bloco.getBacia() != null && bloco.getBacia().getEstado() != null){
                        response.put("estado", bloco.getBacia().getEstado());
                    }
                    return response;
                })
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> searchCampos(String nome){
        List<Campo> campos = campoRepository.findByNome(nome);

        return campos.stream()
                .map(campo -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("campo", campo);
                    if(campo.getBloco().getBacia() != null && campo.getBloco().getBacia().getEstado() != null){
                        response.put("estado", campo.getBloco().getBacia().getEstado());
                    }
                    return response;
                })
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> searchPocos(String nome){
        List<Poco> pocos = pocoRepository.findByNome(nome);

        return pocos.stream()
                .map(poco -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("poco", poco);
                    if(poco.getCampo().getBloco().getBacia() != null && poco.getCampo().getBloco().getBacia().getEstado() != null){
                        response.put("estado", poco.getCampo().getBloco().getBacia().getEstado());
                    }
                    return response;
                })
                .collect(Collectors.toList());
    }
}
