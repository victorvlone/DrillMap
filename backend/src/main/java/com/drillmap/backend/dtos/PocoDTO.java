package com.drillmap.backend.dtos;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PocoDTO {

    private Integer id;
    private String nomePoco;
    private String nomeBloco;
    private String nomeCampo;
    private String nomeBacia;
    private Double latitude;
    private Double longitude;
    private String estado;
    private String situacao;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate inicio; 

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate termino;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate conclusao;

    private String reclassificacao;
    private String tipodePoco;
    private String categoria;
    private String pocoOperador;
    private String cadastro;
}
