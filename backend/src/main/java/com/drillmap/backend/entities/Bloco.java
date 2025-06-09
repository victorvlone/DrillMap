package com.drillmap.backend.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidade que representa um bloco de exploração no sistema.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "bloco")
public class Bloco {

    // Identificador único do bloco (chave primária)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_bloco")
    private Integer id;

    // Nome do bloco
    @Column(name = "nome")
    private String nome;

    // Bacia à qual o bloco pertence (relacionamento muitos-para-um)
    @ManyToOne
    @JoinColumn(name = "id_bacia", nullable = false)
    private Bacia bacia;

    // Lista de campos associados ao bloco (relacionamento um-para-muitos)
    @OneToMany(mappedBy = "bloco", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Campo> campos;

    // Construtor com argumentos principais
    public Bloco(Bacia bacia, String nome) {
        this.bacia = bacia;
        this.nome = nome;
    }

}
