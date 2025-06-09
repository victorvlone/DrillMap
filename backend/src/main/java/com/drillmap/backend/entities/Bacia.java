package com.drillmap.backend.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidade que representa uma bacia sedimentar no sistema.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "bacia")
public class Bacia {

    // Identificador único da bacia (chave primária)
    @Id
    @Column(name = "id_bacia")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Estado onde a bacia está localizada
    @Column(name = "estado")
    private String estado;

    // Nome da bacia
    @Column(name = "nome")
    private String nome;

    // Lista de blocos associados à bacia (relacionamento um-para-muitos)
    @JsonIgnore
    @OneToMany(mappedBy = "bacia", cascade = CascadeType.ALL)
    private List<Bloco> blocos;

    // Construtor com argumentos principais
    public Bacia(String estado, String nome) {
        this.estado = estado;
        this.nome = nome;
    }

}
