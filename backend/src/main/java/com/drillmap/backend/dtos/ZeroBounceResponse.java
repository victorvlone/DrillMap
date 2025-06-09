package com.drillmap.backend.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

/**
 * DTO para resposta da API ZeroBounce.
 * Representa o resultado da validação de e-mail retornado pela ZeroBounce.
 */
@Getter
@Setter
public class ZeroBounceResponse {

    // Status geral da validação do e-mail (ex: valid, invalid, etc)
    @JsonProperty("status")
    private String status;

    // Sub-status detalhado da validação (ex: mailbox_full, spamtrap, etc)
    @JsonProperty("sub_status")
    private String subStatus;

    // Mensagem adicional da resposta, se houver
    @JsonProperty("message")
    private String message;

    // Score de confiabilidade do e-mail (pode ser nulo)
    @JsonProperty("score")
    private Integer score;

    // E-mail validado
    @JsonProperty("email")
    private String email;

}
