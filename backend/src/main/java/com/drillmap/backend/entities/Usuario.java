package com.drillmap.backend.entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidade que representa um usuário do sistema.
 */
@Entity
@Table(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
public class Usuario {

    // Identificador único do usuário
    @Id
    @Column(name = "id_usuario")
    private String id;

    // Primeiro nome do usuário
    @Column(name = "primeiroNome", length = 100, nullable = false)
    private String primeiroNome;

    // Último nome do usuário
    @Column(name = "ultimoNome", length = 100, nullable = false)
    private String ultimoNome;

    // E-mail do usuário (único)
    @Column(name = "email", length = 500, nullable = false, unique = true)
    private String email;

    // Lista de favoritos do usuário (relacionamento 1:N)
    @OneToMany(mappedBy = "usuario")
    @JsonIgnore
    private List <Favoritos> favoritos = new ArrayList<>();

    // Construtor com todos os campos obrigatórios
    public Usuario(String id, String primeiroNome, String ultimoNome, String email) {
        this.id = id;
        this.primeiroNome = primeiroNome;
        this.ultimoNome = ultimoNome;
        this.email = email;
    }

}
