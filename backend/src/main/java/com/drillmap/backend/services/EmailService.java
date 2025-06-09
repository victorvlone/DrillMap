package com.drillmap.backend.services;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;

/**
 * Serviço responsável pelo envio de e-mails utilizando a API do SendGrid.
 */
@Service
public class EmailService {

    // Chave da API do SendGrid, injetada via application.properties ou variável de ambiente
    @Value("${SENDGRID_API_KEY}")
    private String apiKey;

    /**
     * Envia um e-mail para o destinatário informado, com assunto e conteúdo definidos.
     * 
     * @param destinatario E-mail de destino
     * @param assunto Assunto do e-mail
     * @param conteudo Conteúdo do e-mail
     */
    public void enviarEmail(String destinatario, String assunto, String conteudo){
        try {
            // Verifica se a chave da API está configurada
            if (apiKey == null || apiKey.isEmpty()) {
                throw new IllegalStateException("Chave API do SendGrid não encontrada");
            }

            // Cria os objetos de e-mail (remetente, destinatário e conteúdo)
            Email from = new Email("drillmapservice@gmail.com");
            Email to = new Email(destinatario);
            Content content = new Content("text/plain", conteudo);
            Mail mail = new Mail(from, assunto, to, content);
    
            // Instancia o cliente SendGrid com a chave da API
            SendGrid sg = new SendGrid(apiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
    
            // Envia o e-mail e obtém a resposta
            Response response = sg.api(request);
    
            // Exibe informações da resposta no console
            System.out.println("Status Code: " + response.getStatusCode());
            System.out.println("Body: " + response.getBody());
            System.out.println("Headers: " + response.getHeaders());
    
            // Se o status não for 202 (aceito), exibe erro
            if (response.getStatusCode() != 202) {
                System.err.println("Falha ao enviar e-mail: " + response.getBody());
            }
        } catch (IOException e) {
            // Trata exceções de IO e exibe mensagem de erro
            System.err.println("Erro ao enviar e-mail: " + e.getMessage());
        }
    }

}
