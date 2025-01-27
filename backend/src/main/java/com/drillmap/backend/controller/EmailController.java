package com.drillmap.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.drillmap.backend.dtos.EmailRequest;
import com.drillmap.backend.services.EmailService;

@RestController
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/api/enviar-email")
    public ResponseEntity<String> enviarEmail(@RequestBody EmailRequest emailRequest){
       try {      
           emailService.enviarEmail(
               emailRequest.getDestinatario(), 
               emailRequest.getAssunto(), 
               emailRequest.getConteudo()
           );
           return ResponseEntity.ok("E-mail enviado com sucesso!");
       } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao enviar o email: " + e.getMessage());
       } 
    }

}
