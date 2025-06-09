package com.drillmap.backend.services;

import com.opencsv.bean.CsvBindByName;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Classe de representação de uma linha do CSV para importação de dados.
 * Cada campo é mapeado para uma coluna do arquivo CSV usando a anotação @CsvBindByName.
 * Utiliza Lombok para gerar getters, setters, construtores e builder.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DadosCsvRpresentation {

    // Estado do poço (coluna ESTADO no CSV)
    @CsvBindByName(column = "ESTADO")
    private String estado;

    // Nome da bacia (coluna BACIA no CSV)
    @CsvBindByName(column = "BACIA")
    private String nomeBacia;

    // Nome do bloco (coluna BLOCO no CSV)
    @CsvBindByName(column = "BLOCO")
    private String nomeBloco;

    // Nome do campo (coluna CAMPO no CSV)
    @CsvBindByName(column = "CAMPO")
    private String nomeCampo;

    // Nome do poço (coluna POCO no CSV)
    @CsvBindByName(column = "POCO")
    private String nomePoco;

    // Data de início (coluna INICIO no CSV)
    @CsvBindByName(column = "INICIO")
    private String inicio;

    // Data de término (coluna TERMINO no CSV)
    @CsvBindByName(column = "TERMINO")
    private String termino;

    // Data de conclusão (coluna CONCLUSAO no CSV)
    @CsvBindByName(column = "CONCLUSAO")
    private String conclusao;

    // Lâmina d'água em metros (coluna LAMINA_D_AGUA_M no CSV)
    @CsvBindByName(column = "LAMINA_D_AGUA_M")
    private String laminaDagua;

    // Reclassificação do poço (coluna RECLASSIFICACAO no CSV)
    @CsvBindByName(column = "RECLASSIFICACAO")
    private String reclassificacao;

    // Tipo do poço: terra ou mar (coluna TERRA_MAR no CSV)
    @CsvBindByName(column = "TERRA_MAR")
    private String tipodePoco;

    // Categoria do poço (coluna CATEGORIA no CSV)
    @CsvBindByName(column = "CATEGORIA")
    private String categoria;

    // Situação do poço (coluna SITUACAO no CSV)
    @CsvBindByName(column = "SITUACAO")
    private String situacao;

    // Latitude em graus decimais (coluna LATITUDE_BASE_DD no CSV)
    @CsvBindByName(column = "LATITUDE_BASE_DD")
    private String Latitude;

    // Longitude em graus decimais (coluna LONGITUDE_BASE_DD no CSV)
    @CsvBindByName(column = "LONGITUDE_BASE_DD")
    private String Longitude;

    // Nome do operador do poço (coluna POCO_OPERADOR no CSV)
    @CsvBindByName(column = "POCO_OPERADOR")
    private String pocoOperador;

    // Data de cadastro (coluna CADASTRO no CSV)
    @CsvBindByName(column = "CADASTRO")
    private String cadastro;

}
