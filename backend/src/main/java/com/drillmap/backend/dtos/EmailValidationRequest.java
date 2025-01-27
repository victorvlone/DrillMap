package com.drillmap.backend.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public class EmailValidationRequest {

    @NotEmpty(message = "Email não pode ser vazio")
    @Email(message = "Email deve ser válido")
    public String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return email;
    }
}
