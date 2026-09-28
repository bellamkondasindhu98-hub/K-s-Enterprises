package com.ksenterprise.service.impl;

import com.ksenterprise.dto.request.CeoUpdateDTO;
import com.ksenterprise.dto.request.CompanyUpdateDTO;
import com.ksenterprise.dto.response.CeoResponseDTO;
import com.ksenterprise.dto.response.CompanyProfileResponseDTO;
import com.ksenterprise.model.Ceo;
import com.ksenterprise.model.Company;
import com.ksenterprise.model.WebsiteContent;
import com.ksenterprise.repository.CeoRepository;
import com.ksenterprise.repository.CompanyRepository;
import com.ksenterprise.repository.WebsiteContentRepository;
import com.ksenterprise.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final CeoRepository ceoRepository;
    private final WebsiteContentRepository websiteContentRepository;

    @Value("${app.whatsapp.default-number:+91XXXXXXXXXX}")
    private String defaultWhatsappNumber;

    @Override
    @Transactional(readOnly = true)
    public CompanyProfileResponseDTO getCompanyProfile() {
        Company company = companyRepository.findAll().stream().findFirst()
                .orElseGet(() -> Company.builder()
                        .companyName("K's Enterprises")
                        .logoUrl("/assets/logos/ks-enterprises-logo.svg")
                        .gstNumber("[GST_NUMBER_PLACEHOLDER]")
                        .address("[COMPANY_ADDRESS_PLACEHOLDER]")
                        .phone("[PHONE_NUMBER_PLACEHOLDER]")
                        .email("[EMAIL_ADDRESS_PLACEHOLDER]")
                        .whatsappNumber(defaultWhatsappNumber)
                        .description("K's Enterprises is dedicated to providing premium quality fish feed formulated for optimal aquaculture nutrition.")
                        .build());

        CeoResponseDTO ceoDTO = getCeoProfile();

        return CompanyProfileResponseDTO.builder()
                .id(company.getId())
                .companyName(company.getCompanyName())
                .logoUrl(company.getLogoUrl())
                .gstNumber(company.getGstNumber())
                .address(company.getAddress())
                .phone(company.getPhone())
                .email(company.getEmail())
                .whatsappNumber(company.getWhatsappNumber() != null ? company.getWhatsappNumber() : defaultWhatsappNumber)
                .description(company.getDescription())
                .ceo(ceoDTO)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public CeoResponseDTO getCeoProfile() {
        Ceo ceo = ceoRepository.findAll().stream().findFirst()
                .orElseGet(() -> Ceo.builder()
                        .ceoName("[CEO_NAME_PLACEHOLDER]")
                        .ceoImage("/assets/images/ceo-placeholder.svg")
                        .phone("[CEO_PHONE_PLACEHOLDER]")
                        .email("[CEO_EMAIL_PLACEHOLDER]")
                        .bio("Leading K's Enterprises with a vision to deliver scientifically balanced, high-protein fish feed formulations.")
                        .build());

        return CeoResponseDTO.builder()
                .id(ceo.getId())
                .ceoName(ceo.getCeoName())
                .ceoImage(ceo.getCeoImage())
                .phone(ceo.getPhone())
                .email(ceo.getEmail())
                .bio(ceo.getBio())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public String getWebsiteContent(String sectionKey) {
        return websiteContentRepository.findBySectionKey(sectionKey)
                .map(WebsiteContent::getContentJson)
                .orElse("{}");
    }

    @Override
    @Transactional
    public CompanyProfileResponseDTO updateCompany(CompanyUpdateDTO dto) {
        Company company = companyRepository.findAll().stream().findFirst()
                .orElseGet(() -> Company.builder().build());

        company.setCompanyName(dto.getCompanyName());
        if (dto.getLogoUrl() != null) company.setLogoUrl(dto.getLogoUrl());
        if (dto.getGstNumber() != null) company.setGstNumber(dto.getGstNumber());
        if (dto.getAddress() != null) company.setAddress(dto.getAddress());
        if (dto.getPhone() != null) company.setPhone(dto.getPhone());
        if (dto.getEmail() != null) company.setEmail(dto.getEmail());
        if (dto.getWhatsappNumber() != null) company.setWhatsappNumber(dto.getWhatsappNumber());
        if (dto.getDescription() != null) company.setDescription(dto.getDescription());

        companyRepository.save(company);
        return getCompanyProfile();
    }

    @Override
    @Transactional
    public CeoResponseDTO updateCeo(CeoUpdateDTO dto) {
        Company company = companyRepository.findAll().stream().findFirst()
                .orElseGet(() -> companyRepository.save(Company.builder()
                        .companyName("K's Enterprises")
                        .build()));

        Ceo ceo = ceoRepository.findAll().stream().findFirst()
                .orElseGet(() -> Ceo.builder().company(company).build());

        ceo.setCeoName(dto.getCeoName());
        if (dto.getCeoImage() != null) ceo.setCeoImage(dto.getCeoImage());
        if (dto.getPhone() != null) ceo.setPhone(dto.getPhone());
        if (dto.getEmail() != null) ceo.setEmail(dto.getEmail());
        if (dto.getBio() != null) ceo.setBio(dto.getBio());

        Ceo saved = ceoRepository.save(ceo);
        return CeoResponseDTO.builder()
                .id(saved.getId())
                .ceoName(saved.getCeoName())
                .ceoImage(saved.getCeoImage())
                .phone(saved.getPhone())
                .email(saved.getEmail())
                .bio(saved.getBio())
                .build();
    }

    @Override
    @Transactional
    public String updateWebsiteContent(String sectionKey, String contentJson) {
        WebsiteContent content = websiteContentRepository.findBySectionKey(sectionKey)
                .orElseGet(() -> WebsiteContent.builder()
                        .sectionKey(sectionKey)
                        .build());

        content.setContentJson(contentJson);
        websiteContentRepository.save(content);
        return content.getContentJson();
    }
}
