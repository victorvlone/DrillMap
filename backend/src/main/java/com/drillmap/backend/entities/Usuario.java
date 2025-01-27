package com.drillmap.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "primeiroNome", length = 100, nullable = false)
    private String primeiroNome;

    @Column(name = "ultimoNome", length = 100, nullable = false)
    private String ultimoNome;

    @Column(name = "email", length = 500, nullable = false, unique = true)
    private String email;

    @Column(name = "senha", length = 60, nullable = false)
    private String senha;

    @Column(name = "uid", length = 255, nullable = false, unique = true)
    private String uid;

    public Usuario(Integer id, String primeiroNome, String ultimoNome, String email, String senha, String uid) {
        this.id = id;
        this.primeiroNome = primeiroNome;
        this.ultimoNome = ultimoNome;
        this.email = email;
        this.senha = senha;
        this.uid = uid;
    }

}
