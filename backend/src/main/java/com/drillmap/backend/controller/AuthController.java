package com.drillmap.backend.controller;

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

@RestController
@CrossOrigin("*")
@RequestMapping("api/auth")
public class AuthController {

    
    private final EmailService emailService;
    private final Map<String, String> verificationCodes = new HashMap<>();

    public AuthController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/send-code")
    public ResponseEntity<?> sendVerificationCode(@RequestBody UserDTO user){
        
        String code = String.valueOf((int) (Math.random() * 9000) + 1000);

        verificationCodes.put(user.getEmail(), code);

        emailService.enviarEmail(user.getEmail(),
        "código de verificação Drillmap",
        "Prezado(a),\n\nSeu código de verificação é: " + code + 
        ".\n\nPor favor, insira este código na plataforma para concluir a verificação de seu e-mail. Caso você não tenha solicitado este código, desconsidere esta mensagem.\n\nAtenciosamente,\nEquipe DrillMap");

        Map<String, String> response = new HashMap<>();
        response.put("message", "Código enviado!");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody VerificationDTO verification){
        String code = verificationCodes.get(verification.getEmail());

        if(code != null && code.equals(verification.getCode())){
            verificationCodes.remove(verification.getEmail());
            return ResponseEntity.ok("Verificado com sucesso");
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Deu Código inválido ou expirado.");
    }


}
