package com.drillmap.backend.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.drillmap.backend.dtos.UserDTO;
import com.drillmap.backend.dtos.VerificationDTO;
import com.drillmap.backend.services.EmailService;

/**
 * Controller responsável por autenticação e verificação de e-mail.
 * Expõe endpoints para envio e validação de código de verificação por e-mail.
 */
@RestController
@CrossOrigin("*")
@RequestMapping("api/auth")
public class AuthController {

    // Serviço de envio de e-mails
    private final EmailService emailService;

    // Mapa para armazenar códigos de verificação temporários (email -> código)
    private final Map<String, String> verificationCodes = new HashMap<>();

    // Construtor para injeção do serviço de e-mail
    public AuthController(EmailService emailService) {
        this.emailService = emailService;
    }

    /**
     * Endpoint para enviar um código de verificação para o e-mail do usuário.
     * 
     * @param user DTO contendo o e-mail do usuário
     * @return ResponseEntity com mensagem de sucesso
     */
    @PostMapping("/send-code")
    public ResponseEntity<?> sendVerificationCode(@RequestBody UserDTO user){
        
        // Gera um código aleatório de 4 dígitos
        String code = String.valueOf((int) (Math.random() * 9000) + 1000);

        // Armazena o código associado ao e-mail
        verificationCodes.put(user.getEmail(), code);

        // Envia o código por e-mail ao usuário
        emailService.enviarEmail(user.getEmail(),
        "código de verificação Drillmap",
        "Prezado(a),\n\nSeu código de verificação é: " + code + 
        ".\n\nPor favor, insira este código na plataforma para concluir a verificação de seu e-mail. Caso você não tenha solicitado este código, desconsidere esta mensagem.\n\nAtenciosamente,\nEquipe DrillMap");

        // Retorna mensagem de sucesso
        Map<String, String> response = new HashMap<>();
        response.put("message", "Código enviado!");
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para validar o código de verificação informado pelo usuário.
     * 
     * @param verification DTO contendo o e-mail e o código informado
     * @return ResponseEntity indicando se o código é válido ou não
     */
    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody VerificationDTO verification){
        // Busca o código armazenado para o e-mail informado
        String code = verificationCodes.get(verification.getEmail());

        // Verifica se o código informado é igual ao armazenado
        if(code != null && code.equals(verification.getCode())){
            verificationCodes.remove(verification.getEmail());
            return ResponseEntity.ok(Collections.singletonMap("valid", true));
        }

        // Caso o código não seja válido, retorna erro
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                             .body(Collections.singletonMap("valid", false));
    }

}
