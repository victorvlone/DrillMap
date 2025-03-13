package com.drillmap.backend.entities;

import java.util.List;

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

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "bacia")
public class Bacia {

    @Id
    @Column(name = "id_bacia")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "estado")
    private String estado;

    @Column(name = "nome")
    private String nome;

    @OneToMany(mappedBy = "bacia", cascade = CascadeType.ALL)
    private List<Bloco> blocos;

    public Bacia(String estado, String nome) {
        this.estado = estado;
        this.nome = nome;
    }

}
