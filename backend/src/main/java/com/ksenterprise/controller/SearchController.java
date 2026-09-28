package com.ksenterprise.controller;

import com.ksenterprise.dto.ApiResponse;
import com.ksenterprise.dto.response.SearchResultDTO;
import com.ksenterprise.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<ApiResponse<SearchResultDTO>> search(@RequestParam(defaultValue = "") String q) {
        SearchResultDTO result = searchService.search(q);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
