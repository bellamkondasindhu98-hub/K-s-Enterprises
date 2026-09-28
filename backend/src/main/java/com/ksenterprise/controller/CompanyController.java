package com.ksenterprise.controller;

import com.ksenterprise.dto.ApiResponse;
import com.ksenterprise.dto.response.CeoResponseDTO;
import com.ksenterprise.dto.response.CompanyProfileResponseDTO;
import com.ksenterprise.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/company")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<CompanyProfileResponseDTO>> getCompanyProfile() {
        CompanyProfileResponseDTO profile = companyService.getCompanyProfile();
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @GetMapping("/ceo")
    public ResponseEntity<ApiResponse<CeoResponseDTO>> getCeoProfile() {
        CeoResponseDTO ceo = companyService.getCeoProfile();
        return ResponseEntity.ok(ApiResponse.success(ceo));
    }

    @GetMapping("/content/{sectionKey}")
    public ResponseEntity<ApiResponse<String>> getWebsiteContent(@PathVariable String sectionKey) {
        String contentJson = companyService.getWebsiteContent(sectionKey);
        return ResponseEntity.ok(ApiResponse.success(contentJson));
    }
}
