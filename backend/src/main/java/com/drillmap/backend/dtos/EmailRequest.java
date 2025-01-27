package com.drillmap.backend.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailRequest {
    private String destinatario;
    private String Assunto;
    private String Conteudo;
}
