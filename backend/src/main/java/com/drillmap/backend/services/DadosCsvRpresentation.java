package com.drillmap.backend.services;

import com.opencsv.bean.CsvBindByName;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DadosCsvRpresentation {

    @CsvBindByName(column = "ESTADO")
    private String estado;
    @CsvBindByName(column = "BACIA")
    private String nomeBacia;
    @CsvBindByName(column = "BLOCO")
    private String nomeBloco;
    @CsvBindByName(column = "CAMPO")
    private String nomeCampo;
    @CsvBindByName(column = "POCO")
    private String nomePoco;
    @CsvBindByName(column = "INICIO")
    private String inicio;
    @CsvBindByName(column = "TERMINO")
    private String termino;
    @CsvBindByName(column = "CONCLUSAO")
    private String conclusao;
    @CsvBindByName(column = "LAMINA_D_AGUA_M")
    private String laminaDagua;
    @CsvBindByName(column = "RECLASSIFICACAO")
    private String reclassificacao;
    @CsvBindByName(column = "TERRA_MAR")
    private String tipodePoco;
    @CsvBindByName(column = "CATEGORIA")
    private String categoria;
    @CsvBindByName(column = "SITUACAO")
    private String situacao;
    @CsvBindByName(column = "LATITUDE_BASE_DD")
    private String Latitude;
    @CsvBindByName(column = "LONGITUDE_BASE_DD")
    private String Longitude;
    @CsvBindByName(column = "POCO_OPERADOR")
    private String pocoOperador;
    @CsvBindByName(column = "CADASTRO")
    private String cadastro;

}
