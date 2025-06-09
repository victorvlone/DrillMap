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
 * Entidade que representa um campo de petróleo/gás no sistema.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "campo")
public class Campo {

    // Identificador único do campo (chave primária)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_campo")
    private Integer id;

    // Nome do campo
    @Column(name = "nome")
    private String nome;

    // Bloco ao qual o campo pertence (relacionamento muitos-para-um)
    @ManyToOne
    @JoinColumn(name = "id_bloco", nullable = false)
    private Bloco bloco;

    // Lista de poços associados ao campo (relacionamento um-para-muitos)
    @OneToMany(mappedBy = "campo", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Poco> poco;

    // Construtor com argumentos principais
    public Campo(Bloco bloco, String nome) {
        this.bloco = bloco;
        this.nome = nome;
    }
}
