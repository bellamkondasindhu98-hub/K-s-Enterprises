package com.ksenterprise.service;

import com.ksenterprise.dto.request.CeoUpdateDTO;
import com.ksenterprise.dto.request.CompanyUpdateDTO;
import com.ksenterprise.dto.response.CeoResponseDTO;
import com.ksenterprise.dto.response.CompanyProfileResponseDTO;

public interface CompanyService {
    CompanyProfileResponseDTO getCompanyProfile();
    CeoResponseDTO getCeoProfile();
    String getWebsiteContent(String sectionKey);

    CompanyProfileResponseDTO updateCompany(CompanyUpdateDTO dto);
    CeoResponseDTO updateCeo(CeoUpdateDTO dto);
    String updateWebsiteContent(String sectionKey, String contentJson);
}
