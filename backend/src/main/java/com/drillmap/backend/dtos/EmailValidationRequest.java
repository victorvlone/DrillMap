package com.drillmap.backend.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

/**
 * DTO utilizado para requisições de validação de e-mail.
 * Inclui validações para garantir que o e-mail não seja vazio e esteja em formato válido.
 */
public class EmailValidationRequest {

    // E-mail a ser validado (não pode ser vazio e deve ser válido)
    @NotEmpty(message = "Email não pode ser vazio")
    @Email(message = "Email deve ser válido")
    public String email;

    // Getter para o campo email
    public String getEmail() {
        return email;
    }

    // Setter para o campo email
    public void setEmail(String email) {
        this.email = email;
    }

    // Representação em string do objeto (retorna o e-mail)
    @Override
    public String toString() {
        return email;
    }
}
