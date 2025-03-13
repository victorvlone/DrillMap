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

@RestController
@RequestMapping("/api/dadosGeo")
@RequiredArgsConstructor
public class DadosController {

    private final DadosService dadosService;

    @PostMapping(value = "/upload", consumes = {"multipart/form-data"})
    public ResponseEntity<Integer> uploadDados(@RequestPart("file")MultipartFile file) throws IOException{
        int registrosCriados = dadosService.importarCsv(file);
        return ResponseEntity.ok(registrosCriados);
    }

}
