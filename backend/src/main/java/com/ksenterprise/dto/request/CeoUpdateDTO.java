package com.ksenterprise.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CeoUpdateDTO {

    @NotBlank(message = "CEO name is required")
    private String ceoName;

    private String ceoImage;
    private String phone;
    private String email;
    private String bio;
}
