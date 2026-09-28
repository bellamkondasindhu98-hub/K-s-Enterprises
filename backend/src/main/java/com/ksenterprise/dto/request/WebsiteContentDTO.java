package com.ksenterprise.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class WebsiteContentDTO {

    @NotBlank(message = "Section key is required")
    private String sectionKey;

    @NotBlank(message = "Content JSON is required")
    private String contentJson;
}
