package com.drillmap.backend.dtos;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO utilizado para transportar dados de um poço.
 * Inclui informações como nomes relacionados, localização, datas e atributos do poço.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PocoDTO {

    // Identificador do poço
    private Integer id;

    // Nome do poço
    private String nomePoco;

    // Nome do bloco ao qual o poço pertence
    private String nomeBloco;

    // Nome do campo ao qual o poço pertence
    private String nomeCampo;

    // Nome da bacia ao qual o poço pertence
    private String nomeBacia;

    // Latitude do poço
    private Double latitude;

    // Longitude do poço
    private Double longitude;

    // Estado da bacia
    private String estado;

    // Situação do poço (ex: ativo, inativo)
    private String situacao;

    // Data de início das operações do poço
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate inicio; 

    // Data de término das operações do poço
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate termino;

    // Data de conclusão do poço
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate conclusao;

    // Reclassificação do poço
    private String reclassificacao;

    // Tipo do poço (ex: terra, mar)
    private String tipodePoco;

    // Categoria do poço
    private String categoria;

    // Nome do operador do poço
    private String pocoOperador;

    // Data de cadastro do poço
    private String cadastro;
}
