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
@Table(name = "campo")
public class Campo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_campo")
    private Integer id;

    @Column(name = "nome_campo")
    private String nome;

    @ManyToOne
    @JoinColumn(name = "id_bloco", nullable = false)
    private Bloco bloco;


    @OneToMany(mappedBy = "campo", cascade = CascadeType.ALL)
    private List<Poco> poco;

    public Campo(Bloco bloco, String nome) {
        this.bloco = bloco;
        this.nome = nome;
    }
}
