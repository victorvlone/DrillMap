package com.drillmap.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.drillmap.backend.entities.Favoritos;
import com.drillmap.backend.services.FavoritosService;


@RestController
@CrossOrigin("*")
@RequestMapping("/favoritos")
public class FavoritosController {
    
    @Autowired
    private FavoritosService favoritosService;

    @PostMapping("/favoritar")
    public ResponseEntity<?> favoritarPoco(@RequestBody Favoritos favorito){
        try{
            Favoritos novoFavorito = favoritosService.favoritar(favorito);
            return ResponseEntity.ok(novoFavorito);
        } catch (Exception e){
            return ResponseEntity.status(500).body("Erro ao favoritar usuario:" + e.getMessage());
        }
    }

    @GetMapping("/listar/{id}")
    public ResponseEntity<?> listar(@PathVariable String id){
        try {
            List<Favoritos> lista = favoritosService.listarFavoritos(id);
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao listar favoritos:" + e.getMessage());
        }
    }

    @DeleteMapping("/excluir/{id}")
    public ResponseEntity<?> excluirFavorito(@PathVariable Integer id){
        try {
            Optional<Favoritos> favorito = favoritosService.removerFavorito(id);
            if(favorito.isPresent()){
                return ResponseEntity.ok("favorito removido!");
            } else{
                return ResponseEntity.status(404).body("Erro ao remover favorito!");
            }
        } catch (Exception e){
            return ResponseEntity.status(500).body("Erro ao remover favorito: " + e.getMessage());
        }
    }
}
