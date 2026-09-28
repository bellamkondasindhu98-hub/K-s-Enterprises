package com.ksenterprise.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CeoResponseDTO {

    private Long id;
    private String ceoName;
    private String ceoImage;
    private String phone;
    private String email;
    private String bio;
}
