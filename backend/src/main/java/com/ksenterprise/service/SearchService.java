package com.ksenterprise.service;

import com.ksenterprise.dto.response.SearchResultDTO;

public interface SearchService {
    SearchResultDTO search(String query);
}
