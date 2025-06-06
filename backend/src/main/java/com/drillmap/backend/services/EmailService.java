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

@Service
public class EmailService {

    @Value("${SENDGRID_API_KEY}")
    private String apiKey;

    public void enviarEmail(String destinatario, String assunto, String conteudo){
        try {
            if (apiKey == null || apiKey.isEmpty()) {
                throw new IllegalStateException("Chave API do SendGrid não encontrada");
            }

            Email from = new Email("drillmapservice@gmail.com");
            Email to = new Email(destinatario);
            Content content = new Content("text/plain", conteudo);
            Mail mail = new Mail(from, assunto, to, content);
    
            SendGrid sg = new SendGrid(apiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
    
            Response response = sg.api(request);
    
            System.out.println("Status Code: " + response.getStatusCode());
            System.out.println("Body: " + response.getBody());
            System.out.println("Headers: " + response.getHeaders());
    
            if (response.getStatusCode() != 202) {
                System.err.println("Falha ao enviar e-mail: " + response.getBody());
            }
        } catch (IOException e) {
            System.err.println("Erro ao enviar e-mail: " + e.getMessage());
        }
    }

}
