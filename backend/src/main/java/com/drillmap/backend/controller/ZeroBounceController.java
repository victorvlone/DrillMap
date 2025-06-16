package com.drillmap.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.drillmap.backend.dtos.EmailValidationRequest;
import com.drillmap.backend.dtos.ZeroBounceResponse;
import com.zerobounce.ErrorResponse;
import com.zerobounce.ZBValidateResponse;
import com.zerobounce.ZeroBounceSDK;

import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;

/**
 * Controller responsável por expor endpoint para validação de e-mails
 * utilizando a API do ZeroBounce.
 */
@RestController
@CrossOrigin("*")
public class ZeroBounceController {

    // Chave da API do ZeroBounce, injetada via application.properties ou variável de ambiente
    @Value("${ZEROBOUNCE_API_KEY}")
    private String apiKey;

    /**
     * Inicializa o SDK do ZeroBounce com a chave da API após a construção do bean.
     */
    @PostConstruct
    public void init() {
        ZeroBounceSDK.getInstance().initialize(apiKey);
    }

    /**
     * Endpoint para validar um e-mail utilizando o serviço ZeroBounce.
     * 
     * @param request Objeto contendo o e-mail a ser validado
     * @return ResponseEntity com o resultado da validação
     */
    @PostMapping("/validate-email")
    public ResponseEntity<?> validateEmail(@Valid @RequestBody EmailValidationRequest request){
        // Exibe no console o e-mail recebido e a chave da API (para debug)
        System.out.println("Email recebido para validação: " + request.getEmail());
        System.out.println(apiKey);

        // Cria o objeto de resposta que será preenchido pelo callback
        ZeroBounceResponse zeroBounceResponse = new ZeroBounceResponse();

        // Chama o SDK do ZeroBounce para validar o e-mail
        ZeroBounceSDK.getInstance().validate(request.getEmail(), null, 
            new ZeroBounceSDK.OnSuccessCallback<ZBValidateResponse>(){
                @Override
                public void onSuccess(ZBValidateResponse response){
                    System.out.println("validate response=" + response.toString());
                    
                    // Preenche o DTO de resposta com os dados retornados pela API
                    zeroBounceResponse.setStatus(response.getStatus().name());
                    
                    if (response.getSubStatus() != null) {
                        String subStatusName = response.getSubStatus().name();
                        zeroBounceResponse.setSubStatus(subStatusName);
                    } else {
                        zeroBounceResponse.setSubStatus("N/A");
                    }
                    
                    zeroBounceResponse.setEmail(response.getAddress());
                }    
            }, 
            new ZeroBounceSDK.OnErrorCallback() {
                @Override
                public void onError(ErrorResponse errorResponse) {
                    // Exibe erros no console
                    System.out.println("validate error=" + errorResponse.getErrors());
                }
            }
        );

        // Retorna a resposta preenchida (pode estar vazia se a chamada for assíncrona)
        return ResponseEntity.ok(zeroBounceResponse);
    }

}
