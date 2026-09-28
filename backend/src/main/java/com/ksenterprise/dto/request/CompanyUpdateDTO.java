package com.ksenterprise.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CompanyUpdateDTO {

    @NotBlank(message = "Company name is required")
    private String companyName;

    private String logoUrl;
    private String gstNumber;
    private String address;
    private String phone;
    private String email;
    private String whatsappNumber;
    private String description;
}
