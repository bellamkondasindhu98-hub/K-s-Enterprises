package com.ksenterprise.repository;

import com.ksenterprise.model.WebsiteContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WebsiteContentRepository extends JpaRepository<WebsiteContent, Long> {
    Optional<WebsiteContent> findBySectionKey(String sectionKey);
}
