package com.drillmap.backend.dtos;

/**
 * DTO utilizado para transportar dados de verificação,
 * como código de verificação e e-mail do usuário.
 */
public class VerificationDTO {

    // Código de verificação enviado ao usuário
    private String code;

    // E-mail do usuário a ser verificado
    private String email;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
