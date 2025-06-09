package com.drillmap.backend.controller;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.drillmap.backend.services.DadosService;

import lombok.RequiredArgsConstructor;

/**
 * Controller responsável por expor endpoint para upload e importação de dados geográficos via arquivo CSV.
 */
@RestController
@RequestMapping("/api/dadosGeo")
@RequiredArgsConstructor
public class DadosController {

    // Injeta o serviço responsável pela importação dos dados
    private final DadosService dadosService;

    /**
     * Endpoint para upload de arquivo CSV contendo dados geográficos.
     * 
     * @param file Arquivo CSV enviado pelo usuário (multipart/form-data)
     * @return ResponseEntity com a quantidade de registros criados/importados
     * @throws IOException Caso ocorra erro na leitura do arquivo
     */
    @PostMapping(value = "/upload", consumes = {"multipart/form-data"})
    public ResponseEntity<Integer> uploadDados(@RequestPart("file")MultipartFile file) throws IOException{
        int registrosCriados = dadosService.importarCsv(file);
        return ResponseEntity.ok(registrosCriados);
    }

}
