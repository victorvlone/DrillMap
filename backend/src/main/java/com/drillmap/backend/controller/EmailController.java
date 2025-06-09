package com.drillmap.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.drillmap.backend.dtos.EmailRequest;
import com.drillmap.backend.services.EmailService;

/**
 * Controller responsável por expor endpoint para envio de e-mails.
 */
@RestController
public class EmailController {

    // Injeta o serviço de e-mail para realizar o envio
    private final EmailService emailService;

    // Construtor para injeção do serviço de e-mail
    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    /**
     * Endpoint para enviar um e-mail.
     * 
     * @param emailRequest Objeto contendo destinatário, assunto e conteúdo do e-mail
     * @return ResponseEntity com mensagem de sucesso ou erro
     */
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
