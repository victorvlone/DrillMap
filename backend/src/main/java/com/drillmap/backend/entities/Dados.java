package com.drillmap.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = {"idDados", "nomePoco"})
@Table(name = "dados")
@Entity
public class Dados {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_Dados")
    private Integer idDados;

    @Column(name = "estado")
    private String estado;

    @Column(name = "nome_bacia")
    private String nomeBacia;

    @Column(name = "nome_bloco")
    private String nomeBloco;

    @Column(name = "nome_campo")
    private String nomeCampo;

    @Column(name = "nome_poco")
    private String nomePoco;

    @Column(name = "inicio")
    private String inicio;

    @Column(name = "termino")
    private String termino;

    @Column(name = "conclusao")
    private String conclusao;

    @Column(name = "lamina_dagua", length = 45)
    private String laminaDagua;

    @Column(name = "reclassificacao", length = 100)
    private String reclassificacao;

    @Column(name = "tipode_poco")
    private String tipodePoco;

    @Column(name = "categoria", length = 100)
    private String categoria;
    
    @Column(name = "situacao", length = 300)
    private String situacao;

    @Column(name = "latitude")
    private String latitude;

    @Column(name = "longitude")
    private String longitude;

    @Column(name = "poco_operador", length = 20)
    private String pocoOperador;

}
