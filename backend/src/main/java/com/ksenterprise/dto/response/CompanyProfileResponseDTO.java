package com.ksenterprise.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyProfileResponseDTO {

    private Long id;
    private String companyName;
    private String logoUrl;
    private String gstNumber;
    private String address;
    private String phone;
    private String email;
    private String whatsappNumber;
    private String description;
    private CeoResponseDTO ceo;
}
