package com.nikonenko.propertyBoot.repositories;

import com.nikonenko.propertyBoot.models.Property;
import com.nikonenko.propertyBoot.models.PropertyType;
import com.nikonenko.propertyBoot.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Integer>, JpaSpecificationExecutor<Property> {
    @Modifying
    @Query("UPDATE Property p SET p.deleted = true WHERE p.id = :productId")
    void softDeleteById(@Param("productId") Integer productId);

    @Modifying
    @Query("UPDATE Property p SET p.deleted = false WHERE p.id = :productId")
    void restoreById(@Param("productId") Integer productId);

    @Query("SELECT p FROM Property p WHERE p.deleted = false")
    Page<Property> findAllExisting(Pageable pageable);
}
