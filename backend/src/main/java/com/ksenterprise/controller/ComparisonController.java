package com.ksenterprise.controller;

import com.ksenterprise.dto.ApiResponse;
import com.ksenterprise.dto.response.ComparisonMatrixDTO;
import com.ksenterprise.service.ComparisonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/comparison")
@RequiredArgsConstructor
public class ComparisonController {

    private final ComparisonService comparisonService;

    @GetMapping("/{baseProductId}")
    public ResponseEntity<ApiResponse<ComparisonMatrixDTO>> getComparisonMatrix(@PathVariable Long baseProductId) {
        ComparisonMatrixDTO matrix = comparisonService.getComparisonMatrix(baseProductId);
        return ResponseEntity.ok(ApiResponse.success(matrix));
    }
}
