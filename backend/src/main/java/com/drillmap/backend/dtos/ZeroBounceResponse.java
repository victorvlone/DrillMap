package com.drillmap.backend.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ZeroBounceResponse {

    @JsonProperty("status")
    private String status;
    @JsonProperty("sub_status")
    private String subStatus;
    @JsonProperty("message")
    private String message;
    @JsonProperty("score")
    private Integer score;
    @JsonProperty("email")
    private String email;

}
