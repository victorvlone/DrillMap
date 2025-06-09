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

/**
 * Controller responsável por expor endpoints para operações de favoritos dos usuários.
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/favoritos")
public class FavoritosController {
    
    // Injeta o serviço de favoritos para acessar as regras de negócio
    @Autowired
    private FavoritosService favoritosService;

    /**
     * Endpoint para favoritar um poço para um usuário.
     * 
     * @param favorito Objeto Favoritos recebido no corpo da requisição
     * @return ResponseEntity com o favorito salvo ou mensagem de erro
     */
    @PostMapping("/favoritar")
    public ResponseEntity<?> favoritarPoco(@RequestBody Favoritos favorito){
        try{
            Favoritos novoFavorito = favoritosService.favoritar(favorito);
            return ResponseEntity.ok(novoFavorito);
        } catch (Exception e){
            return ResponseEntity.status(500).body("Erro ao favoritar usuario:" + e.getMessage());
        }
    }

    /**
     * Endpoint para listar todos os favoritos de um usuário.
     * 
     * @param id ID do usuário
     * @return Lista de favoritos do usuário ou mensagem de erro
     */
    @GetMapping("/listar/{id}")
    public ResponseEntity<?> listar(@PathVariable String id){
        try {
            List<Favoritos> lista = favoritosService.listarFavoritos(id);
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao listar favoritos:" + e.getMessage());
        }
    }

    /**
     * Endpoint para remover um favorito pelo seu ID.
     * 
     * @param id ID do favorito
     * @return Mensagem de sucesso ou erro
     */
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
