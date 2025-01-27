package com.drillmap.backend.entities;

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
    private Integer id;

    @Column(name = "inicio")
    private String inicio;

    @Column(name = "termino")
    private String termino;

    @Column(name = "conclusao")
    private String conclusao;

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
    private String latitude;

    @Column(name = "longitude")
    private String longitude;

    @Column(name = "poco_operador")
    private String pocoOperador;

    @ManyToOne
    @JoinColumn(name = "dados_id_dados", nullable= false)
    private Dados dados;

    @ManyToOne
    @JoinColumn(name = "id_campo", nullable = false)
    private Campo campo;

    public Poco(Campo campo, String categoria, String conclusao, 
        String inicio, String latitude, String longitude, String nome, String pocoOperador,
        String reclassificacao, String situacao, String termino, String tipodePoco) {

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
    }
}
