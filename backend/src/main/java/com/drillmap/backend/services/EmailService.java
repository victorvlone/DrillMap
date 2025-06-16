package com.drillmap.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.drillmap.backend.dtos.EmailRequest;

/**
 * Serviço responsável pelo envio de e-mails utilizando a API do SendGrid.
 */
@Service
public class EmailService {

    @Autowired
    private JavaMailSender sender;

    /**
     * Envia um e-mail para o destinatário informado, com assunto e conteúdo definidos.
     * 
     * @param destinatario E-mail de destino
     * @param assunto Assunto do e-mail
     * @param conteudo Conteúdo do e-mail
     */
    public void enviarEmail(EmailRequest emailRequest) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();

            // Configurações do e-mail
            message.setFrom("drillmapservice@gmail.com");
            message.setTo(emailRequest.getDestinatario());
            message.setSubject(emailRequest.getAssunto());
            message.setText(emailRequest.getConteudo());

            sender.send(message);

        } catch (Exception e) {
            // Trata exceções de IO e exibe mensagem de erro
            System.err.println("Erro ao enviar e-mail: " + e.getMessage());
        }
    }

}
