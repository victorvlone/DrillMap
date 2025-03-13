package com.drillmap.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PocoDTO {
    private String nome;
    private Double latitude;
    private Double longitude;
}
