package com.ksenterprise.repository;

import com.ksenterprise.model.Ceo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CeoRepository extends JpaRepository<Ceo, Long> {
    Optional<Ceo> findByCompanyId(Long companyId);
}
