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

/**
 * Entidade que representa um poço no sistema.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "poco")
public class Poco {

    // Identificador único do poço (chave primária)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_poco")
    private Integer id;

    // Data de início das operações do poço
    @Column(name = "inicio")
    private LocalDate inicio;

    // Data de término das operações do poço
    @Column(name = "termino")
    private LocalDate termino;

    // Data de conclusão do poço
    @Column(name = "conclusao")
    private LocalDate conclusao;

    // Nome do poço
    @Column(name = "nome")
    private String nome;

    // Reclassificação do poço
    @Column(name = "reclassificacao")
    private String reclassificacao;

    // Tipo do poço (ex: terra, mar)
    @Column(name = "tipo_de_poco")
    private String tipodePoco;

    // Categoria do poço
    @Column(name = "categoria")
    private String categoria;

    // Situação do poço (ex: ativo, inativo)
    @Column(name = "situacao")
    private String situacao;

    // Latitude do poço
    @Column(name = "latitude")
    private Double latitude;

    // Longitude do poço
    @Column(name = "longitude")
    private Double longitude;

    // Nome do operador do poço
    @Column(name = "poco_operador")
    private String pocoOperador;

    // Data de cadastro do poço
    @Column(name = "cadastro")
    private String cadastro;
    
    // Relacionamento muitos-para-um com a entidade Campo
    @ManyToOne
    @JoinColumn(name = "id_campo", nullable = false)
    private Campo campo;

    /**
     * Construtor com todos os campos principais do poço.
     */
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
