package com.drillmap.backend.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerificationDTO {

    private String code;
    private String email;

}
