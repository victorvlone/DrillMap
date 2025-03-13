package com.drillmap.backend.entities;

import java.util.List;

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

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "bloco")
public class Bloco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_bloco")
    private Integer id;

    @Column(name = "nome")
    private String nome;

    @ManyToOne
    @JoinColumn(name = "id_bacia", nullable = false)
    private Bacia bacia;


    @OneToMany(mappedBy = "bloco", cascade = CascadeType.ALL)
    private List<Campo> campos;

    public Bloco(Bacia bacia, String nome) {
        this.bacia = bacia;
        this.nome = nome;
    }

}
