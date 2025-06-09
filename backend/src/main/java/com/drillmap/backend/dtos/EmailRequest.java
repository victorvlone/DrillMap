package com.drillmap.backend.dtos;

import lombok.Getter;
import lombok.Setter;

/**
 * DTO utilizado para transportar os dados necessários para envio de e-mail.
 * Inclui destinatário, assunto e conteúdo do e-mail.
 */
@Getter
@Setter
public class EmailRequest {

    // E-mail do destinatário
    private String destinatario;

    // Assunto do e-mail
    private String Assunto;

    // Conteúdo do e-mail
    private String Conteudo;
}
