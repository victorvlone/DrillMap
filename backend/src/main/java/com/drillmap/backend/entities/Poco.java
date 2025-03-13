package com.drillmap.backend.entities;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "poco")
public class Poco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_poco")
    private Integer id;

    @Column(name = "inicio")
    private LocalDate inicio;

    @Column(name = "termino")
    private LocalDate termino;

    @Column(name = "conclusao")
    private LocalDate conclusao;

    @Column(name = "nome")
    private String nome;

    @Column(name = "reclassificacao")
    private String reclassificacao;

    @Column(name = "tipo_de_poco")
    private String tipodePoco;

    @Column(name = "categoria")
    private String categoria;

    @Column(name = "situacao")
    private String situacao;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "poco_operador")
    private String pocoOperador;

    @Column(name = "cadastro")
    private String cadastro;
    
    @ManyToOne
    @JoinColumn(name = "id_campo", nullable = false)
    private Campo campo;

    public Poco(Campo campo, String categoria, LocalDate conclusao, 
        LocalDate inicio, Double latitude, Double longitude, String nome, String pocoOperador,
        String reclassificacao, String situacao, LocalDate termino, String tipodePoco, String cadastro) {

        this.campo = campo;
        this.categoria = categoria;
        this.conclusao = conclusao;
        this.inicio = inicio;
        this.latitude = latitude;
        this.longitude = longitude;
        this.nome = nome;
        this.pocoOperador = pocoOperador;
        this.reclassificacao = reclassificacao;
        this.situacao = situacao;
        this.termino = termino;
        this.tipodePoco = tipodePoco;
        this.cadastro = cadastro;
    }
}
