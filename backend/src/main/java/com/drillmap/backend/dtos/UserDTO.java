package com.drillmap.backend.dtos;

/**
 * DTO utilizado para transportar dados básicos do usuário,
 * como e-mail e primeiro nome.
 */
public class UserDTO {

    // E-mail do usuário
    private String email;

    // Primeiro nome do usuário
    private String primeiroNome;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPrimeiroNome() {
        return primeiroNome;
    }

    public void setPrimeiroNome(String primeiroNome) {
        this.primeiroNome = primeiroNome;
    }
}
