package com.drillmap.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DadosDTO {

    private Integer idDados;

    private String nomeBacia;

    private String estado;

    private String nomeBloco;

    private String nomeCampo;

    private String nomePoco;

    private String inicio;

    private String termino;

    private String conclusao;

    private String laminaDagua;

    private String reclassificacao;

    private String tipodePoco;
            
    private String categoria;

    private String situacao;                                 

    private String latitude;

    private String longitude;

    private String pocoOperador;

}
