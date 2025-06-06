package com.drillmap.backend.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.drillmap.backend.entities.Usuario;
import com.drillmap.backend.repositories.UsuarioRepository;
import com.drillmap.backend.services.UsuarioService;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private UsuarioService service;
    
    @PostMapping("/salvar")
    public ResponseEntity<?> cadastrarUsuario(@RequestBody Usuario usuario) {
        try {
            Usuario usuarioSalvo = service.salvarUsuario(usuario);
            return ResponseEntity.ok(usuarioSalvo); // Retorna o usuário salvo com status 200
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao salvar usuário: " + e.getMessage()); // Caso haja erro, retorna 500
        }
    }

    @PutMapping
    public Usuario editarUsuario(@RequestBody Usuario usuario){
        Usuario usuarioNovo = repository.save(usuario);
        return usuarioNovo; 
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarUsuario(@PathVariable String id){
        try{
            Optional<Usuario> usuario = service.usuarioPorId(id);

            if(usuario.isPresent()){
                return ResponseEntity.ok(usuario.get());
            } else{
                return ResponseEntity.status(404).body("Usuario não encontrado!");
            }
        }catch(Exception e){
            return ResponseEntity.status(500).body("Erro ao ubscar usuario");
        }
    }

    @DeleteMapping("/{id}")
    public Optional<Usuario> excluirUsuario (@PathVariable String id){
        Optional<Usuario> usuario = repository.findById(id);
        repository.deleteById(id);
        return usuario;
    }

}
