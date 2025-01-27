package com.drillmap.backend.controller;

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

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.validation.Valid;

@RestController
@CrossOrigin("*")
public class ZeroBounceController {

    public static final Dotenv dotenv = Dotenv.configure()
    .directory("C:/Users/ftcpa/Desktop/DrillMap/DrillMapV1")
    .filename("keys.env").load();

    private static final String ZERO_BOUNCE_API_KEY = dotenv.get("ZEROBOUNCE_API_KEY");

    @PostMapping("/validate-email")
    public ResponseEntity<?> validateEmail(@Valid @RequestBody EmailValidationRequest request){
        System.out.println("Email recebido para validação: " + request.getEmail());

        ZeroBounceSDK.getInstance().initialize(ZERO_BOUNCE_API_KEY);

        ZeroBounceResponse zeroBounceResponse = new ZeroBounceResponse();
        ZeroBounceSDK.getInstance().validate(request.getEmail(), null, 
        new ZeroBounceSDK.OnSuccessCallback<ZBValidateResponse>(){
            @Override
            public void onSuccess(ZBValidateResponse response){
                System.out.println("validate response=" + response.toString());
                
                zeroBounceResponse.setStatus(response.getStatus().name());
                zeroBounceResponse.setSubStatus(response.getSubStatus().name());
                zeroBounceResponse.setEmail(response.getAddress());

            }    
        }, new ZeroBounceSDK.OnErrorCallback() {
            @Override
            public void onError(ErrorResponse errorResponse) {
                System.out.println("validate error=" + errorResponse.getErrors());
            }
        });

        return ResponseEntity.ok(zeroBounceResponse);
    }

}
